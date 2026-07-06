import "server-only";
import { siteData } from "./site-data";
import type { ReviewItem } from "./site-data";

export type ReviewsData = {
  rating: number;
  count: number;
  reviews: ReviewItem[];
  /** "google" when live data loaded; "fallback" when using curated quotes. */
  source: "google" | "fallback";
  mapsUrl: string;
};

// Places API (New). A field mask of `reviews` returns Google's top 5 reviews -
// that 5-review cap is a hard Google limitation, not something we can page past.
const SEARCH_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";
const REVALIDATE_SECONDS = 60 * 60 * 24; // refresh once a day

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlacesReview = any;

function fallback(): ReviewsData {
  const r = siteData.reviews;
  return {
    rating: r.rating,
    count: r.count,
    reviews: r.fallback.map((x) => ({ ...x })),
    source: "fallback",
    mapsUrl: r.mapsUrl,
  };
}

function normalize(raw: PlacesReview[]): ReviewItem[] {
  return raw
    .slice(0, 5)
    .map((rv): ReviewItem => ({
      author: rv?.authorAttribution?.displayName ?? "Google reviewer",
      rating: typeof rv?.rating === "number" ? rv.rating : 5,
      text: (rv?.text?.text ?? rv?.originalText?.text ?? "").trim(),
      relativeTime: rv?.relativePublishTimeDescription ?? "",
      photo: rv?.authorAttribution?.photoUri,
    }))
    .filter((r) => r.text.length > 0);
}

/**
 * Live Google reviews via the Places API (New), read server-side so the key is
 * never exposed. Requires GOOGLE_PLACES_API_KEY (key must have "Places API
 * (New)" enabled and NOT be locked to HTTP-referrer restrictions, since this
 * runs from the server). Set GOOGLE_PLACE_ID to skip the text lookup. Falls
 * back to curated quotes on any missing key / error / empty result - never
 * throws, keeping the page resilient.
 */
export async function getGoogleReviews(): Promise<ReviewsData> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return fallback();

  try {
    const placeId = process.env.GOOGLE_PLACE_ID;
    const res = placeId
      ? await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
          headers: {
            "X-Goog-Api-Key": key,
            "X-Goog-FieldMask": "rating,userRatingCount,reviews",
          },
          next: { revalidate: REVALIDATE_SECONDS },
        })
      : await fetch(SEARCH_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": key,
            "X-Goog-FieldMask":
              "places.rating,places.userRatingCount,places.reviews",
          },
          body: JSON.stringify({ textQuery: siteData.reviews.query }),
          next: { revalidate: REVALIDATE_SECONDS },
        });

    if (!res.ok) return fallback();

    const data = await res.json();
    const place = placeId ? data : data?.places?.[0];
    const reviews = normalize(place?.reviews ?? []);
    if (!reviews.length) return fallback();

    return {
      rating: typeof place?.rating === "number" ? place.rating : siteData.reviews.rating,
      count:
        typeof place?.userRatingCount === "number"
          ? place.userRatingCount
          : siteData.reviews.count,
      reviews,
      source: "google",
      mapsUrl: siteData.reviews.mapsUrl,
    };
  } catch {
    return fallback();
  }
}
