// Seed artists + works from scripts/artist-seed.json (skips when artists exist).
// Run: node --env-file=.env.local scripts/db-seed-artists.mjs
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
const seedPath = join(dirname(fileURLToPath(import.meta.url)), "artist-seed.json");
const artists = JSON.parse(readFileSync(seedPath, "utf8"));

try {
  const existing = await sql`SELECT count(*)::int AS count FROM artists`;
  if ((existing[0]?.count ?? 0) > 0) {
    console.log("✓ Artists already seeded - skipping");
    process.exit(0);
  }

  for (let i = 0; i < artists.length; i++) {
    const artist = artists[i];
    const rows = await sql`
      INSERT INTO artists (
        slug, slot_id, sort_order, name, first_name, medium, work_summary, price,
        placeholder, portrait_placeholder, bio, quote, portfolio_link, on_shelf_since, featured
      ) VALUES (
        ${artist.slug},
        ${artist.slotId},
        ${i},
        ${artist.name},
        ${artist.firstName},
        ${artist.medium},
        ${artist.workSummary},
        ${artist.price},
        ${artist.placeholder},
        ${artist.portraitPlaceholder},
        ${artist.bio},
        ${artist.quote},
        ${artist.portfolioLink},
        ${artist.onShelfSince},
        ${artist.featured ?? false}
      )
      RETURNING id
    `;

    const artistId = rows[0].id;
    for (let j = 0; j < artist.works.length; j++) {
      const work = artist.works[j];
      await sql`
        INSERT INTO artist_works (artist_id, sort_order, title, price, placeholder)
        VALUES (${artistId}, ${j}, ${work.title}, ${work.price}, ${work.placeholder})
      `;
    }
  }

  console.log(`✓ Seeded ${artists.length} artists with works`);
} catch (err) {
  console.error("✗ Failed to seed artists:", err.message);
  process.exit(1);
}