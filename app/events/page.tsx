import SiteHeader from "../components/curitiba/SiteHeader";
import SiteFooter from "../components/curitiba/SiteFooter";
import ImagePlaceholder from "../components/curitiba/ImagePlaceholder";
import EventList from "../components/curitiba/EventList";
import EventInquiryForm from "../components/curitiba/EventInquiryForm";
import {
  pastEvents,
  siteData,
  upcomingEvents,
} from "../lib/site-data";

export default function EventsPage() {
  const { eventsPage } = siteData;

  return (
    <div className="min-w-[1100px] bg-white">
      <SiteHeader variant="events" />

      <section className="px-10 pb-[90px] pt-[110px] text-center">
        <div className="mb-5 text-[12px] uppercase tracking-[0.2em] text-faint">
          {eventsPage.eyebrow}
        </div>
        <h1 className="m-0 text-[34px] font-medium uppercase tracking-[0.18em] text-ink">
          {eventsPage.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[540px] text-pretty text-[15px] leading-[1.7] text-muted">
          {eventsPage.body}
        </p>
      </section>

      <section id="upcoming" className="px-10 pb-[120px]">
        <h2 className="mb-12 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
          Upcoming
        </h2>
        <EventList events={upcomingEvents} showSeats />
        <p className="mx-auto mt-10 max-w-[540px] text-center text-[13px] leading-[1.7] text-faint">
          {eventsPage.rsvpNote}
        </p>
      </section>

      <section id="past" className="bg-sand px-10 pb-[120px] pt-[110px]">
        <h2 className="mb-3 text-center text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
          Past events
        </h2>
        <p className="mx-auto mb-16 max-w-[480px] text-pretty text-center text-[15px] leading-[1.6] text-muted">
          A record of the room - what we&apos;ve poured, played, and hung on the
          walls.
        </p>
        <div className="mx-auto grid max-w-[1560px] grid-cols-3 gap-2">
          {pastEvents.map((ev) => (
            <div key={ev.slotId} className="flex flex-col items-center gap-[22px]">
              <ImagePlaceholder label={ev.placeholder} aspect="4/5" />
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

      <section id="host" className="grid min-h-[720px] grid-cols-2">
        <div className="flex flex-col justify-center gap-8 px-20 py-[90px]">
          <h2 className="m-0 text-[15px] font-semibold uppercase tracking-[0.18em] text-ink">
            {eventsPage.host.title}
          </h2>
          <p className="m-0 max-w-[440px] text-pretty text-[15px] leading-[1.7] text-muted">
            {eventsPage.host.body}
          </p>
          <div className="flex max-w-[400px] flex-col gap-4 text-[14px]">
            {eventsPage.host.details.map((row) => (
              <div
                key={row.label}
                className="flex justify-between border-b border-hairline pb-3.5"
              >
                <span className="text-muted">{row.label}</span>
                <span className="text-ink">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center bg-ink px-20 py-[90px] text-white">
          <EventInquiryForm />
        </div>
      </section>

      <SiteFooter variant="compact" />
    </div>
  );
}