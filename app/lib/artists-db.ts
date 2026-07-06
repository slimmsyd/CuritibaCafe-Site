import "server-only";
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
  bio: string;
  quote: string;
  portfolio_link: string;
  on_shelf_since: string;
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
  sold: boolean;
  created_at: string;
};

export type ArtistWithWorks = ArtistRow & { works: ArtistWorkRow[] };

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
    const works = await sql`
      SELECT *
      FROM artist_works
      WHERE artist_id = ${artist.id}
      ORDER BY sort_order ASC, title ASC
    `;
    out.push({ ...artist, works: works as ArtistWorkRow[] });
  }

  return out;
}