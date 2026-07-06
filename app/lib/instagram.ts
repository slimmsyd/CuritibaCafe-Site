import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fetchInstagramFromApify } from "./apify-instagram";
import { getInstagramPostsFromDb } from "./instagram-db";
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
  source: "database" | "manifest" | "apify" | "fallback";
  profileUrl: string;
  handle: string;
};

const MANIFEST_PATH = path.join(
  process.cwd(),
  "public/assets/instagram/manifest.json"
);
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

function withinDays(timestamp: string, days: number): boolean {
  const t = new Date(timestamp).getTime();
  if (Number.isNaN(t)) return false;
  return t >= Date.now() - days * 24 * 60 * 60 * 1000;
}

function mediaType(item: {
  mediaType?: string;
  type?: string;
  videoUrl?: string;
  productType?: string;
}): string {
  if (item.mediaType) return item.mediaType;
  if (item?.type === "Video" || item?.videoUrl || item?.productType === "clips") {
    return "VIDEO";
  }
  return item?.type ?? "IMAGE";
}

async function fromDatabase(): Promise<InstagramFeedData | null> {
  const posts = await getInstagramPostsFromDb(siteData.instagram.postCount);
  if (!posts.length) return null;

  return {
    posts,
    source: "database",
    profileUrl: siteData.instagram.profileUrl,
    handle: siteData.instagram.handle,
  };
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
  try {
    const normalized = await fetchInstagramFromApify();
    if (!normalized.length) return null;

    const posts: InstagramPost[] = normalized.map((post) => ({
      id: post.shortCode,
      imageUrl: post.imageUrl,
      permalink: post.postUrl,
      caption: post.caption,
      timestamp: post.timestamp,
      mediaType: post.mediaType,
    }));

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
 * Instagram feed for the home page. Prefers Neon (synced weekly via Apify cron),
 * then the local manifest in `public/assets/instagram/`, then a live Apify scrape,
 * then an empty feed with the follow CTA.
 */
export async function getInstagramPosts(): Promise<InstagramFeedData> {
  const db = await fromDatabase();
  if (db) return db;

  const manifest = await fromManifest();
  if (manifest) return manifest;

  const live = await fromApify();
  if (live) return live;

  return fallback();
}