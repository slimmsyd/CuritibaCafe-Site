export type ArtistPageCopy = {
  portfolioCta: string;
  counterLine: string;
  sinceLine: string;
  worksHeading: string;
  worksFooter: string;
  soldLabel: string;
  prevArtistLabel: string;
  nextArtistLabel: string;
  featuredEyebrow: string;
  featuredBio: string;
  featuredCta: string;
  featuredPriceLine: string;
};

export const DEFAULT_ARTIST_COPY: ArtistPageCopy = {
  portfolioCta: "Their portfolio",
  counterLine: "At the counter - {price}",
  sinceLine: "On the shelf since {since}",
  worksHeading: "On the shelf",
  worksFooter:
    "Work by neighborhood makers, sold at the counter. Seventy percent of every sale goes directly to the artist.",
  soldLabel: "(sold)",
  prevArtistLabel: "Previous artist",
  nextArtistLabel: "Next artist",
  featuredEyebrow: "Featured this month",
  featuredBio: "",
  featuredCta: "View their work",
  featuredPriceLine: "At the counter - {price}",
};

export type ArtistCopyVars = {
  price: string;
  since: string;
  firstName: string;
};

export function applyCopyTemplate(
  template: string,
  vars: ArtistCopyVars,
): string {
  return template
    .replace(/\{price\}/g, vars.price)
    .replace(/\{since\}/g, vars.since)
    .replace(/\{firstName\}/g, vars.firstName);
}

export function resolveArtistCopy(
  overrides: Partial<ArtistPageCopy> | null | undefined,
  vars: ArtistCopyVars & { bio: string },
): ArtistPageCopy & {
  counterLineRendered: string;
  sinceLineRendered: string;
  worksFooterRendered: string;
  featuredPriceLineRendered: string;
  featuredBioRendered: string;
} {
  const copy = { ...DEFAULT_ARTIST_COPY, ...overrides };
  const featuredBioRendered = copy.featuredBio.trim() || vars.bio;

  return {
    ...copy,
    featuredBioRendered,
    counterLineRendered: applyCopyTemplate(copy.counterLine, vars),
    sinceLineRendered: applyCopyTemplate(copy.sinceLine, vars),
    worksFooterRendered: applyCopyTemplate(copy.worksFooter, vars),
    featuredPriceLineRendered: applyCopyTemplate(copy.featuredPriceLine, vars),
  };
}

export type ArtistCopyRow = {
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
};

export function copyFromRow(row: Partial<ArtistCopyRow>): Partial<ArtistPageCopy> {
  const out: Partial<ArtistPageCopy> = {};
  if (row.portfolio_cta) out.portfolioCta = row.portfolio_cta;
  if (row.counter_line) out.counterLine = row.counter_line;
  if (row.since_line) out.sinceLine = row.since_line;
  if (row.works_heading) out.worksHeading = row.works_heading;
  if (row.works_footer) out.worksFooter = row.works_footer;
  if (row.sold_label) out.soldLabel = row.sold_label;
  if (row.prev_artist_label) out.prevArtistLabel = row.prev_artist_label;
  if (row.next_artist_label) out.nextArtistLabel = row.next_artist_label;
  if (row.featured_eyebrow) out.featuredEyebrow = row.featured_eyebrow;
  if (row.featured_bio) out.featuredBio = row.featured_bio;
  if (row.featured_cta) out.featuredCta = row.featured_cta;
  if (row.featured_price_line) out.featuredPriceLine = row.featured_price_line;
  return out;
}

export function copyToInput(copy: Partial<ArtistPageCopy>): ArtistPageCopy {
  return { ...DEFAULT_ARTIST_COPY, ...copy };
}