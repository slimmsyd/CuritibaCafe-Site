// Seed instagram_posts from public/assets/instagram/manifest.json (no Apify call).
// Run: node --env-file=.env.local scripts/instagram-seed-manifest.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DATABASE_URL not set.");
  process.exit(1);
}

const sql = neon(url);
const manifestPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/assets/instagram/manifest.json",
);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

try {
  const posts = manifest.posts ?? [];
  for (const post of posts) {
    const file = post.files?.[0];
    if (!file) continue;
    await sql`
      INSERT INTO instagram_posts (
        short_code, post_url, caption, timestamp, media_type, image_url, synced_at
      ) VALUES (
        ${post.shortCode},
        ${post.postUrl ?? manifest.profileUrl},
        ${post.caption ?? ""},
        ${post.timestamp ?? new Date().toISOString()},
        ${post.mediaType ?? "IMAGE"},
        ${`/assets/instagram/${file}`},
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

  await sql`
    INSERT INTO instagram_sync (id, last_synced_at, last_status, last_post_count, last_error)
    VALUES (1, now(), 'seeded', ${posts.length}, null)
    ON CONFLICT (id) DO UPDATE SET
      last_synced_at = now(),
      last_status = 'seeded',
      last_post_count = EXCLUDED.last_post_count,
      last_error = null
  `;

  console.log(`✓ Seeded ${posts.length} Instagram posts from manifest`);
} catch (err) {
  console.error("✗ Failed to seed Instagram posts:", err.message);
  process.exit(1);
}