import "server-only";
import { fetchInstagramFromApify } from "./apify-instagram";
import {
  recordInstagramSync,
  upsertInstagramPosts,
} from "./instagram-db";

export type InstagramSyncResult = {
  ok: boolean;
  postCount: number;
  error?: string;
};

export async function syncInstagramFeed(): Promise<InstagramSyncResult> {
  try {
    const posts = await fetchInstagramFromApify();
    const count = await upsertInstagramPosts(posts);
    await recordInstagramSync({ status: "ok", postCount: count });
    return { ok: true, postCount: count };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Instagram sync failed.";
    await recordInstagramSync({ status: "error", postCount: 0, error: message });
    return { ok: false, postCount: 0, error: message };
  }
}