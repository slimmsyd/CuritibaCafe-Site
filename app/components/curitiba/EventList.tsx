import Link from "next/link";
import type { EventItem } from "@/app/lib/site-data";

export default function EventList({
  events,
  showSeats = false,
  rsvpHref = "/events",
}: {
  events: EventItem[];
  showSeats?: boolean;
  rsvpHref?: string;
}) {
  return (
    <div className="mx-auto max-w-[920px] border-t border-hairline">
      {events.map((ev) => (
        <div
          key={`${ev.date}-${ev.title}`}
          className="grid grid-cols-1 gap-3 border-b border-hairline px-1 py-6 sm:grid-cols-[140px_1fr_auto] sm:items-baseline sm:gap-6 sm:py-[30px] lg:grid-cols-[180px_1fr_auto]"
        >
          <div className="text-[12px] uppercase tracking-[0.16em] text-muted">
            {ev.date}
          </div>
          <div>
            <div className="text-[16px] font-medium text-ink sm:text-[17px]">{ev.title}</div>
            <div className="mt-1 text-[14px] text-muted">{ev.detail}</div>
            {showSeats && ev.seats ? (
              <div className="mt-2.5 text-[12px] uppercase tracking-[0.1em] text-faint">
                {ev.seats}
              </div>
            ) : null}
          </div>
          <Link
            href={ev.rsvpHref ?? rsvpHref}
            className="w-fit border-b border-ink pb-0.5 text-[12px] uppercase tracking-[0.16em] text-ink hover:text-muted"
          >
            RSVP
          </Link>
        </div>
      ))}
    </div>
  );
}