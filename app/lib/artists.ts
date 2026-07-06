import "server-only";
import type { ArtistCard, ArtistProfile } from "./site-data";
import {
  artistOrder,
  artistProfiles,
  getAdjacentArtists as getStaticAdjacentArtists,
  getArtistProfile as getStaticArtistProfile,
  shelfArtists,
} from "./site-data";
import { copyToInput, resolveArtistCopy } from "./artist-copy";
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
    imageUrl: row.shelf_image || undefined,
  };
}

function toArtistProfile(row: ArtistRow, works: ArtistWorkRow[]): ArtistProfile {
  const data = {
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
    portraitImageUrl: row.portrait_image || undefined,
    works: works.map((work) => ({
      title: work.title,
      price: work.price,
      placeholder: work.placeholder,
      imageUrl: work.image_url || undefined,
      sold: work.sold,
    })),
  };

  return {
    ...data,
    copy: resolveArtistCopy(copyToInput({
      portfolioCta: row.portfolio_cta,
      counterLine: row.counter_line,
      sinceLine: row.since_line,
      worksHeading: row.works_heading,
      worksFooter: row.works_footer,
      soldLabel: row.sold_label,
      prevArtistLabel: row.prev_artist_label,
      nextArtistLabel: row.next_artist_label,
      featuredEyebrow: row.featured_eyebrow,
      featuredBio: row.featured_bio,
      featuredCta: row.featured_cta,
      featuredPriceLine: row.featured_price_line,
    }), {
      price: data.price,
      since: data.since,
      firstName: data.firstName,
      bio: data.bio,
    }),
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
  imageUrl?: string;
  imagePlaceholder: string;
  copy: ReturnType<typeof resolveArtistCopy>;
} | null> {
  if (dbEnabled) {
    const featured = await getFeaturedArtist();
    if (featured) {
      const copy = resolveArtistCopy(copyToInput({
        portfolioCta: featured.portfolio_cta,
        counterLine: featured.counter_line,
        sinceLine: featured.since_line,
        worksHeading: featured.works_heading,
        worksFooter: featured.works_footer,
        soldLabel: featured.sold_label,
        prevArtistLabel: featured.prev_artist_label,
        nextArtistLabel: featured.next_artist_label,
        featuredEyebrow: featured.featured_eyebrow,
        featuredBio: featured.featured_bio,
        featuredCta: featured.featured_cta,
        featuredPriceLine: featured.featured_price_line,
      }), {
        price: featured.price,
        since: featured.on_shelf_since,
        firstName: featured.first_name,
        bio: featured.bio,
      });

      return {
        slug: featured.slug,
        name: featured.name,
        medium: featured.medium,
        price: featured.price,
        imageUrl: featured.portrait_image || featured.shelf_image || undefined,
        imagePlaceholder: featured.portrait_placeholder || featured.placeholder,
        copy,
      };
    }
  }

  const marina = getStaticArtistProfile("marina");
  if (!marina) return null;

  return {
    slug: marina.slug,
    name: marina.name,
    medium: marina.medium,
    price: marina.price,
    imagePlaceholder: marina.portraitPlaceholder,
    copy: marina.copy,
  };
}