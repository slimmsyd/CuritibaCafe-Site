import SiteHeader from "../components/curitiba/SiteHeader";
import SiteFooter from "../components/curitiba/SiteFooter";
import ImagePlaceholder from "../components/curitiba/ImagePlaceholder";
import CafeImage from "../components/curitiba/CafeImage";
import EventList from "../components/curitiba/EventList";
import EventInquiryForm from "../components/curitiba/EventInquiryForm";
import {
  pastEvents,
  siteData,
  upcomingEvents,
} from "../lib/site-data";
import { getInstagramPosts } from "../lib/instagram";
import { deriveInstagramEvents } from "../lib/instagram-events";

// Refresh hourly so events derived from the Instagram feed move from
// "Upcoming" to "Past events" on their own.
export const revalidate = 3600;

export default async function EventsPage() {
  const { eventsPage } = siteData;
  const instagram = await getInstagramPosts();
  const derived = deriveInstagramEvents(instagram.posts);

  // Real events from the feed replace the template placeholders when present.
  const upcoming = derived.upcoming.length > 0 ? derived.upcoming : upcomingEvents;
  const past = derived.past.length > 0 ? derived.past : pastEvents;

  return (
    <div className="w-full overflow-x-hidden bg-white">
      <SiteHeader variant="events" />

      <section className="px-5 pb-12 pt-16 text-center sm:px-8 sm:pb-16 sm:pt-20 lg:px-10 lg:pb-[90px] lg:pt-[110px]">
        <div className="mb-5 text-[12px] uppercase tracking-[0.2em] text-faint">
          {eventsPage.eyebrow}
        </div>
        <h1 className="m-0 text-[26px] font-medium uppercase tracking-[0.18em] text-ink sm:text-[34px]">
          {eventsPage.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[540px] text-pretty text-[15px] leading-[1.7] text-muted">
          {eventsPage.body}
        </p>
      </section>

      <section id="upcoming" className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-[120px]">
        <h2 className="mb-10 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink sm:mb-12">
          Upcoming
        </h2>
        <EventList events={upcoming} showSeats />
        <p className="mx-auto mt-10 max-w-[540px] text-center text-[13px] leading-[1.7] text-faint">
          {eventsPage.rsvpNote}
        </p>
      </section>

      <section id="past" className="bg-sand px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-[120px] lg:pt-[110px]">
        <h2 className="mb-3 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
          Past events
        </h2>
        <p className="mx-auto mb-12 max-w-[480px] text-pretty text-center text-[15px] leading-[1.6] text-muted sm:mb-16">
          A record of the room - what we&apos;ve poured, played, and hung on the
          walls.
        </p>
        <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
          {past.map((ev) => (
            <div key={ev.slotId} className="flex flex-col items-center gap-[22px]">
              {ev.imageUrl ? (
                <a
                  href={ev.permalink ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <CafeImage src={ev.imageUrl} label={ev.placeholder} aspect="4/5" />
                </a>
              ) : (
                <ImagePlaceholder label={ev.placeholder} aspect="4/5" />
              )}
              <div className="flex flex-col gap-1.5 text-center">
                <div className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink">
                  {ev.title}
                </div>
                <div className="text-[13px] text-muted">{ev.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="host" className="grid grid-cols-1 lg:min-h-[720px] lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-8 px-5 py-14 sm:px-10 sm:py-16 lg:px-20 lg:py-[90px]">
          <h2 className="m-0 text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
            {eventsPage.host.title}
          </h2>
          <p className="m-0 max-w-[440px] text-pretty text-[15px] leading-[1.7] text-muted">
            {eventsPage.host.body}
          </p>
          <div className="flex w-full max-w-[400px] flex-col gap-4 text-[14px]">
            {eventsPage.host.details.map((row) => (
              <div
                key={row.label}
                className="flex justify-between gap-4 border-b border-hairline pb-3.5"
              >
                <span className="text-muted">{row.label}</span>
                <span className="text-right text-ink">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center bg-ink px-5 py-14 sm:px-10 sm:py-16 lg:px-20 lg:py-[90px]">
          <EventInquiryForm />
        </div>
      </section>

      <SiteFooter variant="compact" />
    </div>
  );
}