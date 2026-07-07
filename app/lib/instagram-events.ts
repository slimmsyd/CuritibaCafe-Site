import "server-only";
import type { InstagramPost } from "./instagram";
import type { EventItem, PastEvent } from "./site-data";

/**
 * Derives café events from Instagram captions, so the Events page can show
 * REAL upcoming events (when the feed announces them) and real past events
 * with their photos - instead of hand-written placeholders.
 *
 * Captions like "Trivia THIS THURSDAY at 7" or "This Friday, 10PM-late" carry
 * a weekday relative to the post date; we resolve that to a concrete date and
 * classify it as upcoming or past relative to now. Posts with no event signal
 * (no weekday/tonight + no time/invite wording) are ignored.
 */

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const TIME_RE = /\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b|\b\d{1,2}(?::\d{2})?\s*(?:-|–|to)\s*(?:late|\d{1,2}(?::\d{2})?\s*(?:am|pm))/i;
const INVITE_RE =
  /\b(?:come (?:on )?out|join us|see you|free to play|doors|rsvp|live music|open mic|trivia|poetry|show|night)\b/i;

export type InstagramEvent = {
  id: string;
  title: string;
  detail: string;
  date: Date;
  dateLabel: string;
  imageUrl: string;
  permalink: string;
};

/** Strip @mentions, #hashtags, and URLs; collapse whitespace. */
function cleanLine(line: string): string {
  return line
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[@#][\w.]+/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
}

/** Soften SHOUTING: title-case words of 4+ letters that are all caps. */
function softenCaps(text: string): string {
  return text.replace(/\b[A-Z]{4,}\b/g, (w) => w[0] + w.slice(1).toLowerCase());
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function formatDateLabel(date: Date): string {
  return `${date.toLocaleDateString("en-US", { weekday: "short" })} · ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

/** Resolve "this thursday"/"tonight" in a caption to a date near the post date. */
function resolveEventDate(caption: string, postedAt: Date): Date | null {
  const lower = caption.toLowerCase();

  if (/\btonight\b/.test(lower)) return postedAt;

  for (let i = 0; i < WEEKDAYS.length; i++) {
    if (new RegExp(`\\b${WEEKDAYS[i]}\\b`).test(lower)) {
      // Next occurrence of that weekday on/after the post date.
      const date = new Date(postedAt);
      const delta = (i - date.getDay() + 7) % 7;
      date.setDate(date.getDate() + delta);
      return date;
    }
  }
  return null;
}

/** Parse one post into an event, or null when it doesn't announce one. */
export function parseInstagramEvent(post: InstagramPost): InstagramEvent | null {
  const postedAt = new Date(post.timestamp);
  if (Number.isNaN(postedAt.getTime()) || !post.caption) return null;

  const date = resolveEventDate(post.caption, postedAt);
  if (!date) return null;

  // Require a second signal (a time or invite wording) so ordinary captions
  // that merely mention a weekday don't become events.
  if (!TIME_RE.test(post.caption) && !INVITE_RE.test(post.caption)) return null;

  const lines = post.caption
    .split(/\n+/)
    .map(cleanLine)
    .filter((line) => /[a-z]/i.test(line));
  if (lines.length === 0) return null;

  const title = truncate(softenCaps(lines[0]), 72);
  const detail = truncate(
    lines[1] ?? "See the post for details.",
    120,
  );

  return {
    id: post.id,
    title,
    detail,
    date,
    dateLabel: formatDateLabel(date),
    imageUrl: post.imageUrl,
    permalink: post.permalink,
  };
}

export type DerivedEvents = {
  upcoming: EventItem[];
  past: PastEvent[];
};

/**
 * Split the feed's events around `now`. Upcoming sorted soonest-first; past
 * sorted most-recent-first (capped at 6 for the grid).
 */
export function deriveInstagramEvents(
  posts: InstagramPost[],
  now: Date = new Date(),
): DerivedEvents {
  const events = posts
    .map(parseInstagramEvent)
    .filter((event): event is InstagramEvent => event !== null);

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const upcoming = events
    .filter((event) => event.date >= startOfToday)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(
      (event): EventItem => ({
        date: event.dateLabel,
        title: event.title,
        detail: event.detail,
        rsvpHref: event.permalink,
      }),
    );

  const past = events
    .filter((event) => event.date < startOfToday)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6)
    .map(
      (event): PastEvent => ({
        slotId: `ig-${event.id}`,
        placeholder: event.title,
        title: event.title,
        date: event.dateLabel,
        imageUrl: event.imageUrl,
        permalink: event.permalink,
      }),
    );

  return { upcoming, past };
}
