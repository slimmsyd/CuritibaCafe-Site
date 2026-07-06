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
          className="grid grid-cols-[180px_1fr_auto] items-baseline gap-6 border-b border-hairline px-1 py-[30px]"
        >
          <div className="text-[12px] uppercase tracking-[0.16em] text-muted">
            {ev.date}
          </div>
          <div>
            <div className="text-[17px] font-medium text-ink">{ev.title}</div>
            <div className="mt-1 text-[14px] text-muted">{ev.detail}</div>
            {showSeats && ev.seats ? (
              <div className="mt-2.5 text-[12px] uppercase tracking-[0.1em] text-faint">
                {ev.seats}
              </div>
            ) : null}
          </div>
          <Link
            href={ev.rsvpHref ?? rsvpHref}
            className="border-b border-ink pb-0.5 text-[12px] uppercase tracking-[0.16em] text-ink hover:text-muted"
          >
            RSVP
          </Link>
        </div>
      ))}
    </div>
  );
}