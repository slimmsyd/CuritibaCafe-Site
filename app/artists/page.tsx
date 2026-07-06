import Link from "next/link";
import SiteHeader from "../components/curitiba/SiteHeader";
import SiteFooter from "../components/curitiba/SiteFooter";
import ImagePlaceholder from "../components/curitiba/ImagePlaceholder";
import { shelfArtists, siteData } from "../lib/site-data";

export default function ArtistsPage() {
  const { artistsPage } = siteData;

  return (
    <div className="min-w-[1100px] bg-white">
      <SiteHeader variant="artists" />

      <section className="px-10 pb-[90px] pt-[110px] text-center">
        <div className="mb-5 text-[12px] uppercase tracking-[0.2em] text-faint">
          {artistsPage.eyebrow}
        </div>
        <h1 className="m-0 text-[34px] font-medium uppercase tracking-[0.18em] text-ink">
          {artistsPage.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[560px] text-pretty text-[15px] leading-[1.7] text-muted">
          {artistsPage.body}
        </p>
      </section>

      <section id="featured" className="grid min-h-[680px] grid-cols-2 bg-sand">
        <ImagePlaceholder
          label={artistsPage.featured.imagePlaceholder}
          aspect="fill"
          className="min-h-[680px]"
        />
        <div className="flex flex-col justify-center gap-7 px-20 py-[90px]">
          <div className="text-[12px] uppercase tracking-[0.2em] text-faint">
            Featured this month
          </div>
          <h2 className="m-0 text-[26px] font-medium uppercase tracking-[0.14em] text-ink">
            {artistsPage.featured.name}
          </h2>
          <div className="text-[13px] uppercase tracking-[0.16em] text-muted">
            {artistsPage.featured.medium}
          </div>
          <p className="m-0 max-w-[440px] text-pretty text-[15px] leading-[1.8] text-muted">
            {artistsPage.featured.bio}
          </p>
          <div className="mt-2 flex items-center gap-8">
            <Link
              href="/artists/marina"
              className="border border-ink px-[34px] py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink hover:text-muted"
            >
              View her work
            </Link>
            <span className="text-[13px] text-muted">{artistsPage.featured.price}</span>
          </div>
        </div>
      </section>

      <section id="all" className="px-10 pb-[120px] pt-[110px]">
        <h2 className="mb-16 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
          On the shelf now
        </h2>
        <div className="mx-auto grid max-w-[1560px] grid-cols-4 gap-2 gap-y-14">
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
        className="flex flex-col items-center gap-9 bg-ink px-10 py-[110px] text-center text-white"
      >
        <h2 className="m-0 text-[15px] font-semibold uppercase tracking-[0.18em]">
          {artistsPage.sell.title}
        </h2>
        <p className="m-0 max-w-[520px] text-pretty text-[15px] leading-[1.7] text-newsletter-muted">
          {artistsPage.sell.body}
        </p>
        <Link
          href={artistsPage.sell.ctaHref}
          className="bg-white px-[42px] py-[15px] text-[12px] font-semibold uppercase tracking-[0.16em] text-ink hover:text-muted"
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