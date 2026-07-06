import { siteData } from "./site-data";

export type NormalizedInstagramPost = {
  shortCode: string;
  postUrl: string;
  caption: string;
  timestamp: string;
  mediaType: string;
  imageUrl: string;
};

const ACTOR_ID = "apify~instagram-scraper";
const APIFY_RUN_URL = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items`;
const FETCH_TIMEOUT_MS = 90_000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApifyPost = any;

export function apifyToken(): string | null {
  return process.env.APIFY_API_TOKEN ?? process.env.APIFY_TOKEN ?? null;
}

function withinDays(timestamp: string, days: number): boolean {
  const t = new Date(timestamp).getTime();
  if (Number.isNaN(t)) return false;
  return t >= Date.now() - days * 24 * 60 * 60 * 1000;
}

function pickImageUrl(item: ApifyPost): string | null {
  for (const url of item?.images ?? []) {
    if (typeof url === "string" && url.length > 0) return url;
  }
  if (typeof item?.displayUrl === "string" && item.displayUrl.length > 0) {
    return item.displayUrl;
  }
  return null;
}

function resolveMediaType(
  item: ApifyPost | {
    mediaType?: string;
    type?: string;
    videoUrl?: string;
    productType?: string;
  },
): string {
  if ("mediaType" in item && item.mediaType) return item.mediaType;
  if (item?.type === "Video" || item?.videoUrl || item?.productType === "clips") {
    return "VIDEO";
  }
  return item?.type ?? "IMAGE";
}

export function normalizeApifyPosts(items: ApifyPost[]): NormalizedInstagramPost[] {
  const { daysWindow, postCount } = siteData.instagram;

  return items
    .filter((item) => !item?.error)
    .filter((item) => withinDays(item?.timestamp ?? "", daysWindow))
    .map((item): NormalizedInstagramPost | null => {
      const imageUrl = pickImageUrl(item);
      if (!imageUrl) return null;

      const shortCode = String(item?.shortCode ?? item?.id ?? "").trim();
      if (!shortCode) return null;

      return {
        shortCode,
        postUrl: item?.url ?? siteData.instagram.profileUrl,
        caption: (item?.caption ?? "").trim(),
        timestamp: item?.timestamp ?? new Date().toISOString(),
        mediaType: resolveMediaType(item),
        imageUrl,
      };
    })
    .filter((post): post is NormalizedInstagramPost => post !== null)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, postCount);
}

export async function fetchInstagramFromApify(): Promise<NormalizedInstagramPost[]> {
  const token = apifyToken();
  if (!token) {
    throw new Error("APIFY_API_TOKEN is not set.");
  }

  const { daysWindow, postCount } = siteData.instagram;
  const url = `${APIFY_RUN_URL}?token=${encodeURIComponent(token)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      directUrls: [siteData.instagram.profileUrl],
      resultsType: "posts",
      resultsLimit: Math.max(postCount, 30),
      addParentData: false,
      onlyPostsNewerThan: `${daysWindow} days`,
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Apify request failed (${res.status}).`);
  }

  const items = (await res.json()) as ApifyPost[];
  if (!items?.length) return [];
  if (items.length === 1 && items[0]?.error) {
    throw new Error(String(items[0].error ?? "Apify returned an error."));
  }

  return normalizeApifyPosts(items);
}