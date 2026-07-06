import { siteData } from "./site-data";

export type CafeIntent =
  | "hours"
  | "location"
  | "menu"
  | "events"
  | "artists"
  | "greeting"
  | "newsletter"
  | "unknown";

type FaqEntry = {
  intent: CafeIntent;
  keywords: string[];
  patterns?: RegExp[];
};

const FAQ_ENTRIES: FaqEntry[] = [
  {
    intent: "greeting",
    keywords: [],
    patterns: [
      /^(hi|hey|hello|howdy|good (morning|afternoon|evening)|what'?s up)\b/i,
    ],
  },
  {
    intent: "hours",
    keywords: [
      "hour",
      "hours",
      "open",
      "close",
      "closed",
      "closing",
      "when",
      "time",
      "schedule",
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "weekend",
      "tonight",
    ],
  },
  {
    intent: "location",
    keywords: [
      "where",
      "location",
      "address",
      "direction",
      "directions",
      "find",
      "map",
      "maps",
      "located",
      "parking",
      "caroline",
      "fredericksburg",
      "downtown",
      "visit",
      "drive",
    ],
    patterns: [
      /where\s+(are\s+you|is\s+(it|the|curitiba)|do\s+i\s+find)/i,
      /\b(find\s+us|find\s+you|get\s+there|how\s+to\s+get)\b/i,
      /\b(address|located|directions|downtown)\b/i,
    ],
  },
  {
    intent: "menu",
    keywords: [
      "menu",
      "drink",
      "drinks",
      "coffee",
      "espresso",
      "pour",
      "pastry",
      "pastries",
      "food",
      "order",
      "cone",
      "cones",
      "soft-serve",
      "soft serve",
      "cocktail",
      "cocktails",
      "bar",
      "serve",
    ],
  },
  {
    intent: "events",
    keywords: [
      "event",
      "events",
      "cupping",
      "rsvp",
      "class",
      "listening",
      "opening",
      "upcoming",
      "tonight",
      "calendar",
    ],
  },
  {
    intent: "artists",
    keywords: [
      "artist",
      "artists",
      "shelf",
      "maker",
      "makers",
      "ceramic",
      "ceramics",
      "print",
      "prints",
      "textile",
      "textiles",
      "sell",
      "shop",
      "gallery",
    ],
  },
  {
    intent: "newsletter",
    keywords: ["newsletter", "subscribe", "subscription", "mailing", "list"],
    patterns: [/\bemail\b/i],
  },
];

/** Minimum keyword hits to trust local matching without DeepSeek. */
const MATCH_THRESHOLD = 1;

export function normalizeQuery(input: string): string {
  return input.trim().toLowerCase().replace(/[^\w\s'-]/g, " ");
}

export function scoreIntent(query: string): { intent: CafeIntent; score: number } {
  const q = normalizeQuery(query);
  if (!q) return { intent: "unknown", score: 0 };

  let best: CafeIntent = "unknown";
  let bestScore = 0;

  for (const entry of FAQ_ENTRIES) {
    let score = 0;

    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += 1;
    }

    for (const pattern of entry.patterns ?? []) {
      if (pattern.test(q)) score += 2;
    }

    if (score > bestScore) {
      bestScore = score;
      best = entry.intent;
    }
  }

  return { intent: best, score: bestScore };
}

export function getAnswerForIntent(intent: CafeIntent): string {
  const { brand, visit, menu, eventsPreview, artistsPreview, newsletter } =
    siteData;

  switch (intent) {
    case "greeting":
      return `Welcome to ${brand.name}. We're pouring the summer single-origin series right now. Ask about our hours, menu, events, or how to find us.`;

    case "hours": {
      const lines = visit.hours.map((row) => `${row.days}: ${row.time}`);
      return `Our hours:\n${lines.join("\n")}\n\nFriday and Saturday we're open until 10 PM. Saturday opens at 9 AM. That's the only weekend difference.`;
    }

    case "location":
      return siteData.chat.locationAnswer;

    case "menu": {
      const items = menu.items.map((item) => item.label).join(", ");
      return `From the bar this season: ${items}.\n\nSee the full seasonal menu on the homepage.`;
    }

    case "events": {
      const upcoming = eventsPreview.items
        .slice(0, 3)
        .map((ev) => `${ev.date} · ${ev.title}`)
        .join("\n");
      return `A few things coming up:\n${upcoming}\n\nSee all events on our Events page.`;
    }

    case "artists": {
      const artists = artistsPreview.items
        .map((a) => `${a.name} (${a.work}, ${a.price})`)
        .join("\n");
      return `On the artist shelf now:\n${artists}\n\nSeventy percent of every sale goes directly to the maker.`;
    }

    case "newsletter":
      return `${newsletter.body} Scroll to First to know on the homepage to subscribe.`;

    default:
      return `I can help with hours, the menu, events, artists, or our address at ${visit.address[0]}. For anything else, ask at the counter when you visit.`;
  }
}

export type ChatReplySource = "keyword" | "deepseek" | "fallback";

export type ChatReply = {
  reply: string;
  intent: CafeIntent;
  source: ChatReplySource;
};

export function getChatReplyFromIntent(
  intent: CafeIntent,
  source: ChatReplySource,
): ChatReply {
  return {
    reply: getAnswerForIntent(intent),
    intent,
    source,
  };
}

export function getLocalChatReply(input: string): ChatReply {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      reply:
        "Ask me about hours, the menu, events, artists, or how to find us.",
      intent: "unknown",
      source: "fallback",
    };
  }

  const { intent, score } = scoreIntent(trimmed);
  if (score >= MATCH_THRESHOLD && intent !== "unknown") {
    return getChatReplyFromIntent(intent, "keyword");
  }

  return {
    reply: "",
    intent: "unknown",
    source: "fallback",
  };
}