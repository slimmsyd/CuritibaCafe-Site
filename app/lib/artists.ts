import "server-only";
import type { ArtistCard, ArtistProfile } from "./site-data";
import {
  artistOrder,
  artistProfiles,
  getAdjacentArtists as getStaticAdjacentArtists,
  getArtistProfile as getStaticArtistProfile,
  shelfArtists,
} from "./site-data";
import {
  getActiveArtists,
  getArtistBySlug,
  getFeaturedArtist,
  type ArtistRow,
  type ArtistWorkRow,
} from "./artists-db";
import { dbEnabled } from "./db";

function toArtistCard(row: ArtistRow): ArtistCard {
  return {
    slug: row.slug,
    slotId: row.slot_id,
    placeholder: row.placeholder,
    name: row.name,
    work: row.work_summary,
    price: row.price,
    medium: row.medium,
  };
}

function toArtistProfile(row: ArtistRow, works: ArtistWorkRow[]): ArtistProfile {
  return {
    slug: row.slug,
    name: row.name,
    firstName: row.first_name,
    medium: row.medium,
    price: row.price,
    since: row.on_shelf_since,
    link: row.portfolio_link,
    bio: row.bio,
    quote: row.quote,
    portraitPlaceholder: row.portrait_placeholder,
    works: works.map((work) => ({
      title: work.title,
      price: work.price,
      placeholder: work.placeholder,
    })),
  };
}

export async function getArtistsPreviewItems(): Promise<ArtistCard[]> {
  const artists = await listShelfArtists();
  return artists.slice(0, 3);
}

export async function listShelfArtists(): Promise<ArtistCard[]> {
  if (dbEnabled) {
    const rows = await getActiveArtists();
    if (rows.length > 0) return rows.map(toArtistCard);
  }
  return shelfArtists;
}

export async function listArtistSlugs(): Promise<string[]> {
  if (dbEnabled) {
    const rows = await getActiveArtists();
    if (rows.length > 0) return rows.map((row) => row.slug);
  }
  return [...artistOrder];
}

export async function getArtistProfile(
  slug: string,
): Promise<ArtistProfile | undefined> {
  if (dbEnabled) {
    const row = await getArtistBySlug(slug);
    if (row) return toArtistProfile(row, row.works);
  }
  return getStaticArtistProfile(slug);
}

export async function getAdjacentArtists(slug: string) {
  if (dbEnabled) {
    const slugs = await listArtistSlugs();
    const i = slugs.indexOf(slug);
    if (i === -1) return null;

    const prevSlug = slugs[(i + slugs.length - 1) % slugs.length];
    const nextSlug = slugs[(i + 1) % slugs.length];
    const prev = await getArtistProfile(prevSlug);
    const next = await getArtistProfile(nextSlug);
    if (!prev || !next) return null;

    return {
      prev: { slug: prevSlug, name: prev.name },
      next: { slug: nextSlug, name: next.name },
    };
  }

  return getStaticAdjacentArtists(slug);
}

export async function getFeaturedArtistCard(): Promise<{
  slug: string;
  name: string;
  medium: string;
  price: string;
} | null> {
  if (dbEnabled) {
    const featured = await getFeaturedArtist();
    if (featured) {
      return {
        slug: featured.slug,
        name: featured.name,
        medium: featured.medium,
        price: featured.price,
      };
    }
  }

  const marina = artistProfiles.marina;
  return {
    slug: marina.slug,
    name: marina.name,
    medium: marina.medium,
    price: marina.price,
  };
}