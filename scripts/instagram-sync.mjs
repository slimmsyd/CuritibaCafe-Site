// Pull latest @curitiba_art_cafe posts from Apify into Neon.
// Run: node --env-file=.env.local scripts/instagram-sync.mjs
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
const token = process.env.APIFY_API_TOKEN ?? process.env.APIFY_TOKEN;
const profileUrl = "https://www.instagram.com/curitiba_art_cafe/";
const postCount = 6;
const daysWindow = 30;

if (!url) {
  console.error("✗ DATABASE_URL not set.");
  process.exit(1);
}
if (!token) {
  console.error("✗ APIFY_API_TOKEN not set.");
  process.exit(1);
}

const sql = neon(url);
const ACTOR_ID = "apify~instagram-scraper";
const APIFY_RUN_URL = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items`;

function pickImageUrl(item) {
  for (const image of item?.images ?? []) {
    if (typeof image === "string" && image.length > 0) return image;
  }
  if (typeof item?.displayUrl === "string" && item.displayUrl.length > 0) {
    return item.displayUrl;
  }
  return null;
}

function withinDays(timestamp, days) {
  const t = new Date(timestamp).getTime();
  if (Number.isNaN(t)) return false;
  return t >= Date.now() - days * 24 * 60 * 60 * 1000;
}

function normalize(items) {
  return items
    .filter((item) => !item?.error)
    .filter((item) => withinDays(item?.timestamp ?? "", daysWindow))
    .map((item) => {
      const imageUrl = pickImageUrl(item);
      const shortCode = String(item?.shortCode ?? item?.id ?? "").trim();
      if (!imageUrl || !shortCode) return null;
      return {
        shortCode,
        postUrl: item?.url ?? profileUrl,
        caption: String(item?.caption ?? "").trim(),
        timestamp: item?.timestamp ?? new Date().toISOString(),
        mediaType: item?.mediaType ?? item?.type ?? "IMAGE",
        imageUrl,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, postCount);
}

async function recordSync(result) {
  await sql`
    INSERT INTO instagram_sync (id, last_synced_at, last_status, last_post_count, last_error)
    VALUES (1, now(), ${result.status}, ${result.postCount}, ${result.error ?? null})
    ON CONFLICT (id) DO UPDATE SET
      last_synced_at = now(),
      last_status = EXCLUDED.last_status,
      last_post_count = EXCLUDED.last_post_count,
      last_error = EXCLUDED.last_error
  `;
}

try {
  const res = await fetch(`${APIFY_RUN_URL}?token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      directUrls: [profileUrl],
      resultsType: "posts",
      resultsLimit: Math.max(postCount, 30),
      addParentData: false,
      onlyPostsNewerThan: `${daysWindow} days`,
    }),
    signal: AbortSignal.timeout(90_000),
  });

  if (!res.ok) {
    throw new Error(`Apify request failed (${res.status})`);
  }

  const items = await res.json();
  const posts = normalize(items);

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

  await recordSync({ status: "ok", postCount: posts.length });
  console.log(`✓ Synced ${posts.length} Instagram posts to Neon`);
} catch (err) {
  const message = err instanceof Error ? err.message : "Instagram sync failed";
  await recordSync({ status: "error", postCount: 0, error: message });
  console.error("✗", message);
  process.exit(1);
}