import "server-only";
import { type ArtistPageCopy } from "./artist-copy";
import { dbEnabled, sql } from "./db";

export type ArtistRow = {
  id: number;
  slug: string;
  slot_id: string;
  sort_order: number;
  name: string;
  first_name: string;
  medium: string;
  work_summary: string;
  price: string;
  placeholder: string;
  portrait_placeholder: string;
  portrait_image: string;
  shelf_image: string;
  bio: string;
  quote: string;
  portfolio_link: string;
  on_shelf_since: string;
  portfolio_cta: string;
  counter_line: string;
  since_line: string;
  works_heading: string;
  works_footer: string;
  sold_label: string;
  prev_artist_label: string;
  next_artist_label: string;
  featured_eyebrow: string;
  featured_bio: string;
  featured_cta: string;
  featured_price_line: string;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ArtistWorkRow = {
  id: number;
  artist_id: number;
  sort_order: number;
  title: string;
  price: string;
  placeholder: string;
  image_url: string;
  sold: boolean;
  created_at: string;
};

export type ArtistWithWorks = ArtistRow & { works: ArtistWorkRow[] };

export type ArtistWorkInput = {
  id?: number;
  title: string;
  price: string;
  placeholder: string;
  imageUrl: string;
  sold: boolean;
  sortOrder: number;
};

export type ArtistInput = {
  id?: number;
  slug: string;
  name: string;
  firstName: string;
  medium: string;
  workSummary: string;
  price: string;
  placeholder: string;
  portraitPlaceholder: string;
  portraitImage: string;
  shelfImage: string;
  bio: string;
  quote: string;
  portfolioLink: string;
  onShelfSince: string;
  copy: ArtistPageCopy;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  works: ArtistWorkInput[];
};

export async function getActiveArtists(): Promise<ArtistRow[]> {
  if (!dbEnabled) return [];
  const rows = await sql`
    SELECT *
    FROM artists
    WHERE active = true
    ORDER BY sort_order ASC, name ASC
  `;
  return rows as ArtistRow[];
}

export async function getAllArtists(): Promise<ArtistRow[]> {
  if (!dbEnabled) return [];
  const rows = await sql`
    SELECT *
    FROM artists
    ORDER BY sort_order ASC, name ASC
  `;
  return rows as ArtistRow[];
}

export async function getArtistBySlug(slug: string): Promise<ArtistWithWorks | null> {
  if (!dbEnabled) return null;

  const artists = await sql`
    SELECT *
    FROM artists
    WHERE slug = ${slug} AND active = true
    LIMIT 1
  `;
  const artist = artists[0] as ArtistRow | undefined;
  if (!artist) return null;

  return attachWorks(artist);
}

export async function getArtistById(id: number): Promise<ArtistWithWorks | null> {
  if (!dbEnabled) return null;

  const artists = await sql`
    SELECT *
    FROM artists
    WHERE id = ${id}
    LIMIT 1
  `;
  const artist = artists[0] as ArtistRow | undefined;
  if (!artist) return null;

  return attachWorks(artist);
}

async function attachWorks(artist: ArtistRow): Promise<ArtistWithWorks> {
  const works = await sql`
    SELECT *
    FROM artist_works
    WHERE artist_id = ${artist.id}
    ORDER BY sort_order ASC, title ASC
  `;
  return { ...artist, works: works as ArtistWorkRow[] };
}

export async function getFeaturedArtist(): Promise<ArtistRow | null> {
  if (!dbEnabled) return null;
  const rows = await sql`
    SELECT *
    FROM artists
    WHERE active = true AND featured = true
    ORDER BY sort_order ASC
    LIMIT 1
  `;
  return (rows[0] as ArtistRow | undefined) ?? null;
}

export async function getArtistCount(): Promise<number> {
  if (!dbEnabled) return 0;
  const rows = await sql`SELECT count(*)::int AS count FROM artists WHERE active = true`;
  return (rows[0]?.count as number) ?? 0;
}

export async function getArtistWorkCount(): Promise<number> {
  if (!dbEnabled) return 0;
  const rows = await sql`
    SELECT count(*)::int AS count
    FROM artist_works w
    JOIN artists a ON a.id = w.artist_id
    WHERE a.active = true
  `;
  return (rows[0]?.count as number) ?? 0;
}

export async function listArtistsWithWorks(limit = 100): Promise<ArtistWithWorks[]> {
  if (!dbEnabled) return [];

  const artists = await getActiveArtists();
  const out: ArtistWithWorks[] = [];

  for (const artist of artists.slice(0, limit)) {
    out.push(await attachWorks(artist));
  }

  return out;
}

export async function listAllArtistsWithWorks(limit = 200): Promise<ArtistWithWorks[]> {
  if (!dbEnabled) return [];

  const artists = await getAllArtists();
  const out: ArtistWithWorks[] = [];

  for (const artist of artists.slice(0, limit)) {
    out.push(await attachWorks(artist));
  }

  return out;
}

export async function saveArtist(input: ArtistInput): Promise<number> {
  if (!dbEnabled) throw new Error("Database is disabled.");

  const slug = input.slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Slug must be lowercase letters, numbers, and hyphens.");
  }

  if (input.featured) {
    await sql`UPDATE artists SET featured = false WHERE featured = true`;
  }

  let artistId = input.id;

  if (artistId) {
    await sql`
      UPDATE artists SET
        slug = ${slug},
        slot_id = ${`artist-${slug}`},
        sort_order = ${input.sortOrder},
        name = ${input.name},
        first_name = ${input.firstName},
        medium = ${input.medium},
        work_summary = ${input.workSummary},
        price = ${input.price},
        placeholder = ${input.placeholder},
        portrait_placeholder = ${input.portraitPlaceholder},
        portrait_image = ${input.portraitImage},
        shelf_image = ${input.shelfImage},
        bio = ${input.bio},
        quote = ${input.quote},
        portfolio_link = ${input.portfolioLink},
        on_shelf_since = ${input.onShelfSince},
        portfolio_cta = ${input.copy.portfolioCta},
        counter_line = ${input.copy.counterLine},
        since_line = ${input.copy.sinceLine},
        works_heading = ${input.copy.worksHeading},
        works_footer = ${input.copy.worksFooter},
        sold_label = ${input.copy.soldLabel},
        prev_artist_label = ${input.copy.prevArtistLabel},
        next_artist_label = ${input.copy.nextArtistLabel},
        featured_eyebrow = ${input.copy.featuredEyebrow},
        featured_bio = ${input.copy.featuredBio},
        featured_cta = ${input.copy.featuredCta},
        featured_price_line = ${input.copy.featuredPriceLine},
        featured = ${input.featured},
        active = ${input.active},
        updated_at = now()
      WHERE id = ${artistId}
    `;
  } else {
    const rows = await sql`
      INSERT INTO artists (
        slug, slot_id, sort_order, name, first_name, medium, work_summary, price,
        placeholder, portrait_placeholder, portrait_image, shelf_image, bio, quote,
        portfolio_link, on_shelf_since,
        portfolio_cta, counter_line, since_line, works_heading, works_footer,
        sold_label, prev_artist_label, next_artist_label,
        featured_eyebrow, featured_bio, featured_cta, featured_price_line,
        featured, active
      ) VALUES (
        ${slug},
        ${`artist-${slug}`},
        ${input.sortOrder},
        ${input.name},
        ${input.firstName},
        ${input.medium},
        ${input.workSummary},
        ${input.price},
        ${input.placeholder},
        ${input.portraitPlaceholder},
        ${input.portraitImage},
        ${input.shelfImage},
        ${input.bio},
        ${input.quote},
        ${input.portfolioLink},
        ${input.onShelfSince},
        ${input.copy.portfolioCta},
        ${input.copy.counterLine},
        ${input.copy.sinceLine},
        ${input.copy.worksHeading},
        ${input.copy.worksFooter},
        ${input.copy.soldLabel},
        ${input.copy.prevArtistLabel},
        ${input.copy.nextArtistLabel},
        ${input.copy.featuredEyebrow},
        ${input.copy.featuredBio},
        ${input.copy.featuredCta},
        ${input.copy.featuredPriceLine},
        ${input.featured},
        ${input.active}
      )
      RETURNING id
    `;
    artistId = rows[0].id as number;
  }

  await sql`DELETE FROM artist_works WHERE artist_id = ${artistId}`;

  for (const work of input.works) {
    await sql`
      INSERT INTO artist_works (
        artist_id, sort_order, title, price, placeholder, image_url, sold
      ) VALUES (
        ${artistId},
        ${work.sortOrder},
        ${work.title},
        ${work.price},
        ${work.placeholder},
        ${work.imageUrl},
        ${work.sold}
      )
    `;
  }

  return artistId;
}

export async function deactivateArtist(id: number): Promise<void> {
  if (!dbEnabled) throw new Error("Database is disabled.");
  await sql`
    UPDATE artists
    SET active = false, featured = false, updated_at = now()
    WHERE id = ${id}
  `;
}