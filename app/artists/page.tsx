import Link from "next/link";
import SiteHeader from "../components/curitiba/SiteHeader";
import SiteFooter from "../components/curitiba/SiteFooter";
import ImagePlaceholder from "../components/curitiba/ImagePlaceholder";
import { getFeaturedArtistCard, listShelfArtists } from "../lib/artists";
import { siteData } from "../lib/site-data";

export const dynamic = "force-dynamic";

export default async function ArtistsPage() {
  const { artistsPage } = siteData;
  const [shelfArtists, featured] = await Promise.all([
    listShelfArtists(),
    getFeaturedArtistCard(),
  ]);

  return (
    <div className="w-full overflow-x-hidden bg-white">
      <SiteHeader variant="artists" />

      <section className="px-5 pb-12 pt-16 text-center sm:px-8 sm:pb-16 sm:pt-20 lg:px-10 lg:pb-[90px] lg:pt-[110px]">
        <div className="mb-5 text-[12px] uppercase tracking-[0.2em] text-faint">
          {artistsPage.eyebrow}
        </div>
        <h1 className="m-0 text-[26px] font-medium uppercase tracking-[0.18em] text-ink sm:text-[34px]">
          {artistsPage.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[560px] text-pretty text-[15px] leading-[1.7] text-muted">
          {artistsPage.body}
        </p>
      </section>

      {featured ? (
        <section id="featured" className="grid grid-cols-1 bg-sand lg:min-h-[680px] lg:grid-cols-2">
          <ImagePlaceholder
            label={artistsPage.featured.imagePlaceholder}
            aspect="fill"
            className="min-h-[320px] lg:min-h-[680px]"
          />
          <div className="flex flex-col justify-center gap-7 px-5 py-14 sm:px-10 sm:py-16 lg:px-20 lg:py-[90px]">
            <div className="text-[12px] uppercase tracking-[0.2em] text-faint">
              Featured this month
            </div>
            <h2 className="m-0 text-[22px] font-medium uppercase tracking-[0.14em] text-ink sm:text-[26px]">
              {featured.name}
            </h2>
            <div className="text-[13px] uppercase tracking-[0.16em] text-muted">
              {featured.medium}
            </div>
            <p className="m-0 max-w-[440px] text-pretty text-[15px] leading-[1.8] text-muted">
              {artistsPage.featured.bio}
            </p>
            <div className="mt-2 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <Link
                href={`/artists/${featured.slug}`}
                className="border border-ink px-[34px] py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink hover:text-muted"
              >
                View her work
              </Link>
              <span className="text-[13px] text-muted">{featured.price}</span>
            </div>
          </div>
        </section>
      ) : null}

      <section id="all" className="px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-[120px] lg:pt-[110px]">
        <h2 className="mb-12 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink sm:mb-16">
          On the shelf now
        </h2>
        <div className="mx-auto grid max-w-[1560px] grid-cols-2 gap-x-2 gap-y-10 sm:grid-cols-3 sm:gap-y-14 lg:grid-cols-4">
          {shelfArtists.map((artist) => (
            <div key={artist.slug} className="flex flex-col items-center gap-4">
              <ImagePlaceholder label={artist.placeholder} aspect="1/1" />
              <div className="flex flex-col gap-[5px] text-center">
                <Link
                  href={`/artists/${artist.slug}`}
                  className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ink hover:text-muted"
                >
                  {artist.name}
                </Link>
                <div className="text-[11px] uppercase tracking-[0.12em] text-faint">
                  {artist.medium} · {artist.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="sell"
        className="flex flex-col items-center gap-7 bg-ink px-5 py-16 text-center text-white sm:gap-9 sm:px-8 sm:py-20 lg:px-10 lg:py-[110px]"
      >
        <h2 className="m-0 text-[15px] font-semibold uppercase tracking-[0.18em]">
          {artistsPage.sell.title}
        </h2>
        <p className="m-0 max-w-[520px] text-pretty text-[15px] leading-[1.7] text-newsletter-muted">
          {artistsPage.sell.body}
        </p>
        <Link
          href={artistsPage.sell.ctaHref}
          className="bg-white px-8 py-[15px] text-[12px] font-semibold uppercase tracking-[0.16em] text-ink hover:text-muted sm:px-[42px]"
        >
          {artistsPage.sell.cta}
        </Link>
        <div className="text-[12px] tracking-[0.1em] text-muted">
          {artistsPage.sell.note}
        </div>
      </section>

      <SiteFooter
        variant="compact"
        compactLink={{ href: "/events", label: "Events" }}
      />
    </div>
  );
}