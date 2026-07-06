import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { siteData } from "./site-data";

export type InstagramPost = {
  id: string;
  imageUrl: string;
  permalink: string;
  caption: string;
  timestamp: string;
  mediaType: string;
};

export type InstagramFeedData = {
  posts: InstagramPost[];
  /** Where the feed data came from. */
  source: "manifest" | "apify" | "fallback";
  profileUrl: string;
  handle: string;
};

const ACTOR_ID = "apify~instagram-scraper";
const APIFY_RUN_URL = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items`;
const MANIFEST_PATH = path.join(
  process.cwd(),
  "public/assets/instagram/manifest.json"
);
const REVALIDATE_SECONDS = 60 * 60 * 6;
const FETCH_TIMEOUT_MS = 90_000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApifyPost = any;

type ManifestFile = {
  posts?: Array<{
    shortCode: string;
    postUrl?: string;
    caption?: string;
    timestamp?: string;
    mediaType?: string;
    files?: string[];
  }>;
};

function fallback(): InstagramFeedData {
  const ig = siteData.instagram;
  return {
    posts: [],
    source: "fallback",
    profileUrl: ig.profileUrl,
    handle: ig.handle,
  };
}

function apifyToken(): string | null {
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

function mediaType(item: ApifyPost | { mediaType?: string; type?: string; videoUrl?: string; productType?: string }): string {
  if ("mediaType" in item && item.mediaType) return item.mediaType;
  if (item?.type === "Video" || item?.videoUrl || item?.productType === "clips") {
    return "VIDEO";
  }
  return item?.type ?? "IMAGE";
}

function normalizeApify(items: ApifyPost[]): InstagramPost[] {
  const { daysWindow, postCount } = siteData.instagram;

  return items
    .filter((item) => !item?.error)
    .filter((item) => withinDays(item?.timestamp ?? "", daysWindow))
    .map((item): InstagramPost | null => {
      const imageUrl = pickImageUrl(item);
      if (!imageUrl) return null;

      const caption = (item?.caption ?? "").trim();
      return {
        id: String(item?.id ?? item?.shortCode ?? imageUrl),
        imageUrl,
        permalink: item?.url ?? siteData.instagram.profileUrl,
        caption,
        timestamp: item?.timestamp ?? "",
        mediaType: mediaType(item),
      };
    })
    .filter((post): post is InstagramPost => post !== null)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, postCount);
}

async function fromManifest(): Promise<InstagramFeedData | null> {
  try {
    const raw = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8")) as ManifestFile;
    const { daysWindow, postCount } = siteData.instagram;

    const posts = (raw.posts ?? [])
      .filter((p) => withinDays(p.timestamp ?? "", daysWindow))
      .sort((a, b) => (b.timestamp ?? "").localeCompare(a.timestamp ?? ""))
      .slice(0, postCount)
      .flatMap((p): InstagramPost[] => {
        const file = p.files?.[0];
        if (!file) return [];
        return [
          {
            id: p.shortCode,
            imageUrl: `/assets/instagram/${file}`,
            permalink: p.postUrl ?? siteData.instagram.profileUrl,
            caption: (p.caption ?? "").trim(),
            timestamp: p.timestamp ?? "",
            mediaType: mediaType(p),
          },
        ];
      });

    if (!posts.length) return null;

    return {
      posts,
      source: "manifest",
      profileUrl: siteData.instagram.profileUrl,
      handle: siteData.instagram.handle,
    };
  } catch {
    return null;
  }
}

async function fromApify(): Promise<InstagramFeedData | null> {
  const token = apifyToken();
  if (!token) return null;

  const { daysWindow, postCount } = siteData.instagram;
  const url = `${APIFY_RUN_URL}?token=${encodeURIComponent(token)}`;

  try {
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
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) return null;

    const items = (await res.json()) as ApifyPost[];
    if (!items?.length) return null;
    if (items.length === 1 && items[0]?.error) return null;

    const posts = normalizeApify(items);
    if (!posts.length) return null;

    return {
      posts,
      source: "apify",
      profileUrl: siteData.instagram.profileUrl,
      handle: siteData.instagram.handle,
    };
  } catch {
    return null;
  }
}

/**
 * Instagram feed for the home page. Prefers the local manifest in
 * `public/assets/instagram/` (populated by Apify, images downloaded locally so
 * CDN URLs do not expire). Falls back to a live Apify scrape, then an empty
 * feed with the follow CTA.
 */
export async function getInstagramPosts(): Promise<InstagramFeedData> {
  const manifest = await fromManifest();
  if (manifest) return manifest;

  const live = await fromApify();
  if (live) return live;

  return fallback();
}