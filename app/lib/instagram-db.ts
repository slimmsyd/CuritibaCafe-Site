import "server-only";
import { dbEnabled, sql } from "./db";
import type { InstagramPost } from "./instagram";

export type InstagramPostRow = {
  id: number;
  short_code: string;
  post_url: string;
  caption: string;
  timestamp: string;
  media_type: string;
  image_url: string;
  synced_at: string;
};

export type InstagramSyncState = {
  last_synced_at: string | null;
  last_status: string;
  last_post_count: number;
  last_error: string | null;
};

function toInstagramPost(row: InstagramPostRow): InstagramPost {
  return {
    id: row.short_code,
    imageUrl: row.image_url,
    permalink: row.post_url,
    caption: row.caption,
    timestamp: row.timestamp,
    mediaType: row.media_type,
  };
}

export async function getInstagramPostsFromDb(
  limit = 12,
): Promise<InstagramPost[]> {
  if (!dbEnabled) return [];

  const rows = await sql`
    SELECT *
    FROM instagram_posts
    ORDER BY timestamp DESC
    LIMIT ${limit}
  `;

  return (rows as InstagramPostRow[]).map(toInstagramPost);
}

export async function getInstagramPostCount(): Promise<number> {
  if (!dbEnabled) return 0;
  const rows = await sql`SELECT count(*)::int AS count FROM instagram_posts`;
  return (rows[0]?.count as number) ?? 0;
}

export async function getInstagramSyncState(): Promise<InstagramSyncState | null> {
  if (!dbEnabled) return null;

  const rows = await sql`
    SELECT last_synced_at, last_status, last_post_count, last_error
    FROM instagram_sync
    WHERE id = 1
    LIMIT 1
  `;

  return (rows[0] as InstagramSyncState | undefined) ?? null;
}

export async function upsertInstagramPosts(
  posts: Array<{
    shortCode: string;
    postUrl: string;
    caption: string;
    timestamp: string;
    mediaType: string;
    imageUrl: string;
  }>,
): Promise<number> {
  if (!dbEnabled) throw new Error("Database is disabled.");

  for (const post of posts) {
    await sql`
      INSERT INTO instagram_posts (
        short_code, post_url, caption, timestamp, media_type, image_url, synced_at
      ) VALUES (
        ${post.shortCode},
        ${post.postUrl},
        ${post.caption},
        ${post.timestamp},
        ${post.mediaType},
        ${post.imageUrl},
        now()
      )
      ON CONFLICT (short_code) DO UPDATE SET
        post_url = EXCLUDED.post_url,
        caption = EXCLUDED.caption,
        timestamp = EXCLUDED.timestamp,
        media_type = EXCLUDED.media_type,
        image_url = EXCLUDED.image_url,
        synced_at = now()
    `;
  }

  const codes = posts.map((post) => post.shortCode);
  if (codes.length > 0) {
    await sql`
      DELETE FROM instagram_posts
      WHERE NOT (short_code = ANY(${codes}))
    `;
  } else {
    await sql`DELETE FROM instagram_posts`;
  }

  return posts.length;
}

export async function recordInstagramSync(result: {
  status: "ok" | "error";
  postCount: number;
  error?: string;
}): Promise<void> {
  if (!dbEnabled) return;

  await sql`
    INSERT INTO instagram_sync (id, last_synced_at, last_status, last_post_count, last_error)
    VALUES (
      1,
      now(),
      ${result.status},
      ${result.postCount},
      ${result.error ?? null}
    )
    ON CONFLICT (id) DO UPDATE SET
      last_synced_at = now(),
      last_status = EXCLUDED.last_status,
      last_post_count = EXCLUDED.last_post_count,
      last_error = EXCLUDED.last_error
  `;
}