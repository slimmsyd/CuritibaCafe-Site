import Link from "next/link";
import AnnouncementBar from "./components/curitiba/AnnouncementBar";
import SiteHeader from "./components/curitiba/SiteHeader";
import SiteFooter from "./components/curitiba/SiteFooter";
import HeroVideo from "./components/curitiba/HeroVideo";
import CafeImage from "./components/curitiba/CafeImage";
import ImagePlaceholder from "./components/curitiba/ImagePlaceholder";
import NewsletterForm from "./components/curitiba/NewsletterForm";
import EventList from "./components/curitiba/EventList";
import LocationMap from "./components/curitiba/LocationMap";
import Reviews from "./components/curitiba/Reviews";
import InstagramFeed from "./components/curitiba/InstagramFeed";
import SocialLinks from "./components/curitiba/SocialLinks";
import { getArtistsPreviewItems } from "./lib/artists";
import { siteData } from "./lib/site-data";
import { getGoogleReviews } from "./lib/reviews";
import { getInstagramPosts } from "./lib/instagram";

export const maxDuration = 90;

export default async function HomePage() {
  const [reviews, instagram, artistsPreview] = await Promise.all([
    getGoogleReviews(),
    getInstagramPosts(),
    getArtistsPreviewItems(),
  ]);

  return (
    <div className="w-full overflow-x-hidden bg-white">
      <AnnouncementBar />
      <SiteHeader variant="landing" />

      <section id="top" className="sticky top-0 z-0">
        <div className="relative h-[72vh] min-h-[420px] overflow-hidden bg-ink sm:h-[78vh] sm:min-h-[520px] lg:h-[82vh] lg:min-h-[560px]">
          <HeroVideo src={siteData.hero.video} />
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.35) 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-8 z-[2] flex flex-col items-center gap-4 px-5 sm:bottom-14 sm:gap-[18px]">
            <div
              className="text-center text-[12px] uppercase tracking-[0.2em] text-white sm:text-[13px]"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}
            >
              {siteData.hero.season}
            </div>
            <Link
              href={siteData.hero.cta.href}
              className="pointer-events-auto border border-ink bg-white px-8 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink hover:text-muted sm:px-[42px] sm:py-[15px] sm:text-[13px]"
            >
              {siteData.hero.cta.label}
            </Link>
            <SocialLinks variant="hero" />
            <div
              role="img"
              aria-label={`Rated ${reviews.rating.toFixed(1)} out of 5 stars from ${reviews.count}+ reviews`}
              className="mt-1 flex flex-wrap items-center justify-center gap-3 bg-ink/70 px-5 py-3 text-white sm:mt-2 sm:gap-4 sm:px-9 sm:py-4"
            >
              <div className="flex gap-[7px]" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-[15px] tracking-[0.08em] sm:text-[16px]" aria-hidden>
                {reviews.rating.toFixed(1)}
              </span>
              <span className="hidden h-[18px] w-px bg-white/40 sm:block" aria-hidden />
              <span
                className="text-[11px] uppercase tracking-[0.2em] text-white/90 sm:text-[13px]"
                aria-hidden
              >
                {reviews.count}+ Reviews
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 bg-white shadow-[0_-24px_60px_rgba(0,0,0,0.12)]">
        <section id="menu" className="px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-[120px] lg:pt-[110px]">
          <h2 className="mb-10 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink sm:mb-16">
            {siteData.menu.title}
          </h2>
          <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
            {siteData.menu.items.map((item) => (
              <div key={item.id} className="flex flex-col items-center gap-[26px]">
                <ImagePlaceholder label={item.placeholder} aspect="4/5" />
                <Link
                  href="#menu"
                  className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink hover:text-muted"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section id="events" className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-[120px]">
          <h2 className="mb-3 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
            {siteData.eventsPreview.title}
          </h2>
          <p className="mx-auto mb-10 max-w-[520px] text-pretty text-center text-[15px] leading-[1.6] text-muted sm:mb-14">
            {siteData.eventsPreview.body}
          </p>
          <EventList events={siteData.eventsPreview.items} />
          <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:mt-12 sm:flex-row sm:gap-12">
            <Link
              href="/events"
              className="border border-ink px-[34px] py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink hover:text-muted"
            >
              All events
            </Link>
            <Link
              href="/events#host"
              className="border-b border-ink pb-0.5 text-[12px] uppercase tracking-[0.16em] text-ink hover:text-muted"
            >
              Host your event here
            </Link>
          </div>
        </section>

        <section id="artists" className="bg-sand px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-[120px] lg:pt-[110px]">
          <h2 className="mb-3 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
            {siteData.artistsPreview.title}
          </h2>
          <p className="mx-auto mb-12 max-w-[560px] text-pretty text-center text-[15px] leading-[1.6] text-muted sm:mb-16">
            {siteData.artistsPreview.body}
          </p>
          <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
            {artistsPreview.map((artist) => (
              <div key={artist.slug} className="flex flex-col items-center gap-[22px]">
                <CafeImage
                  src={artist.imageUrl}
                  label={artist.placeholder}
                  aspect="4/5"
                />
                <div className="flex flex-col gap-1.5 text-center">
                  <div className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink">
                    {artist.name}
                  </div>
                  <div className="text-[14px] text-muted">
                    {artist.work} - {artist.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:mt-14 sm:flex-row sm:gap-12">
            <Link
              href="/artists"
              className="border border-ink bg-white px-[34px] py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink hover:text-muted"
            >
              Meet the artists
            </Link>
            <Link
              href="/artists#sell"
              className="border-b border-ink pb-0.5 text-[12px] uppercase tracking-[0.16em] text-ink hover:text-muted"
            >
              Sell your work here
            </Link>
          </div>
        </section>

        <InstagramFeed data={instagram} />

        <Reviews data={reviews} />

        <section id="visit" className="grid min-h-0 grid-cols-1 lg:min-h-[620px] lg:grid-cols-2">
          <LocationMap query={siteData.visit.mapQuery} className="min-h-[320px] lg:min-h-[620px]" />
          <div className="flex flex-col items-center justify-center gap-8 px-5 py-14 text-center sm:gap-10 sm:px-10 sm:py-20 lg:px-[60px]">
            <h2 className="m-0 text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
              {siteData.visit.title}
            </h2>
            <div className="text-[16px] leading-[1.7] text-ink">
              {siteData.visit.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </div>
            <div className="flex w-full max-w-[260px] flex-col gap-2.5 text-[14px] text-muted">
              {siteData.visit.hours.map((row) => (
                <div key={row.days} className="flex justify-between gap-4 sm:gap-8">
                  <span>{row.days}</span>
                  <span className="text-ink">{row.time}</span>
                </div>
              ))}
            </div>
            <Link
              href={siteData.visit.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-ink pb-0.5 text-[12px] uppercase tracking-[0.16em] text-ink hover:text-muted"
            >
              Get directions
            </Link>
          </div>
        </section>

        <section
          id="newsletter"
          className="flex flex-col items-center gap-7 bg-ink px-5 py-16 text-white sm:gap-9 sm:px-8 sm:py-20 lg:px-10 lg:py-[110px]"
        >
          <h2 className="m-0 text-center text-[15px] font-semibold uppercase tracking-[0.18em]">
            {siteData.newsletter.title}
          </h2>
          <p className="m-0 max-w-[480px] text-pretty text-center text-[15px] leading-[1.6] text-newsletter-muted">
            {siteData.newsletter.body}
          </p>
          <NewsletterForm />
        </section>

        <SiteFooter variant="full" />
      </div>
    </div>
  );
}