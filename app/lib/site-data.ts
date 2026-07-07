import { resolveArtistCopy } from "./artist-copy";

export type MenuItem = {
  id: string;
  label: string;
  placeholder: string;
};

export type EventItem = {
  date: string;
  title: string;
  detail: string;
  seats?: string;
  rsvpHref?: string;
};

export type ArtistCard = {
  slug: string;
  slotId: string;
  placeholder: string;
  name: string;
  work: string;
  price: string;
  medium: string;
  imageUrl?: string;
};

export type ArtistWork = {
  title: string;
  price: string;
  placeholder: string;
  imageUrl?: string;
  sold?: boolean;
};

export type ArtistProfileData = {
  slug: string;
  name: string;
  firstName: string;
  medium: string;
  price: string;
  since: string;
  link: string;
  bio: string;
  quote: string;
  portraitPlaceholder: string;
  portraitImageUrl?: string;
  works: ArtistWork[];
};

export type ArtistProfile = ArtistProfileData & {
  copy: ReturnType<typeof resolveArtistCopy>;
};

export type PastEvent = {
  slotId: string;
  placeholder: string;
  title: string;
  date: string;
  /** Photo from the Instagram post (events derived from the feed). */
  imageUrl?: string;
  /** Link to the Instagram post. */
  permalink?: string;
};

export type ReviewItem = {
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
  photo?: string;
};

export type SocialLinkIcon =
  | "instagram"
  | "tiktok"
  | "website"
  | "events"
  | "press";

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon: SocialLinkIcon;
  external?: boolean;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const siteData = {
  brand: {
    name: "Curitiba Art Café",
    logo: "/curitiba-logo.png",
    logoAlt: "Curitiba Art Café",
    domain: "www.curitibaartcafe.com",
    tagline: "Craft coffee and cocktails.",
    copyright: "© 2026 Curitiba Art Café. Made with the neighborhood.",
  },

  announcement: {
    show: true,
    text: "Now pouring - the summer single-origin series",
  },

  seo: {
    title: "Curitiba Art Café | Craft Coffee & Cocktails in Fredericksburg, VA",
    description:
      "Curitiba Art Café is a neighborhood art café in historic downtown Fredericksburg — craft coffee, cocktails, live music, events, and local art on the shelf.",
    ogTitle: "Curitiba Art Café",
    ogDescription:
      "Craft coffee and cocktails in downtown Fredericksburg. Live events, local art, and a room worth staying for.",
  },

  nav: [
    { href: "/#menu", label: "Menu" },
    { href: "/events", label: "Events" },
    { href: "/artists", label: "Artists" },
    { href: "/#visit", label: "Visit" },
    { href: "/#faq", label: "FAQ" },
    { href: "/#newsletter", label: "Newsletter" },
  ],

  hero: {
    video: "/curitiba-cafe.mp4",
    placeholder: "Drop your hero image - the bar, morning light",
    season: "Summer 2026",
    cta: { label: "The seasonal menu", href: "#menu" },
  },

  menu: {
    title: "From the bar",
    items: [
      {
        id: "menu-espresso",
        label: "Signature espresso",
        placeholder: "Espresso shot, close",
      },
      {
        id: "menu-slowbar",
        label: "Slow-bar pour overs",
        placeholder: "Pour-over at the slow bar",
      },
      {
        id: "menu-pastry",
        label: "House pastries",
        placeholder: "House pastries",
      },
      {
        id: "menu-cone",
        label: "Soft-serve cones",
        placeholder: "Soft-serve cone at the bar",
      },
    ] satisfies MenuItem[],
  },

  eventsPreview: {
    title: "Upcoming at Curitiba",
    body: "The room after hours - cuppings, listening nights, and openings hosted with the neighborhood.",
    items: [
      {
        date: "Thu · Jul 16",
        title: "Cupping at the slow bar",
        detail:
          "Taste the summer single-origin series with our head roaster. 12 seats.",
      },
      {
        date: "Sat · Jul 25",
        title: "Listening night: vinyl & filter",
        detail: "A local selector, one turntable, and batch brew until late.",
      },
      {
        date: "Fri · Aug 7",
        title: "Artist shelf opening",
        detail: "Meet the next three makers joining the shelf. First pour on us.",
      },
      {
        date: "Sat · Aug 15",
        title: "Latte art, hands on",
        detail: "A small class at the machine - milk, pitchers, patience.",
      },
    ] satisfies EventItem[],
  },

  artistsPreview: {
    title: "The artist shelf",
    body: "Work by neighborhood makers, sold at the counter. Seventy percent of every sale goes directly to the artist.",
    items: [
      {
        slug: "jaime-rodriguez",
        slotId: "artist-jaime-rodriguez",
        placeholder: "Jaime Rodriguez - Futuro Photography",
        name: "Jaime Rodriguez",
        work: "Photography",
        price: "from $100",
        medium: "Futuro Photography",
        imageUrl: "/assets/artists/jaime-rodriguez/work-3.jpg",
      },
    ] satisfies ArtistCard[],
  },

  visit: {
    title: "Visit",
    address: ["919 Caroline Street", "Historic Downtown Fredericksburg, VA"],
    hours: [
      { days: "Sunday - Tuesday", time: "10:00 - 17:00" },
      { days: "Wednesday", time: "10:00 - 19:00" },
      { days: "Thursday", time: "10:00 - 17:00" },
      { days: "Friday", time: "10:00 - 22:00" },
      { days: "Saturday", time: "9:00 - 22:00" },
    ],
    mapQuery: "Curitiba Art Café, 919 Caroline St, Fredericksburg, VA 22401",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Curitiba+Art+Caf%C3%A9%2C+919+Caroline+St%2C+Fredericksburg%2C+VA+22401",
  },

  newsletter: {
    title: "First to know",
    body: "New menus, event invitations, and the next artists on the shelf - once a month, nothing more.",
  },

  faq: {
    title: "Questions",
    body: "Everything you might want to know before you walk through the door.",
    footer: "Still have a question?",
    cta: "Ask at the counter",
    ctaHref: "/#visit",
    items: [
      {
        id: "hours",
        question: "What are your hours?",
        answer:
          "Sunday through Tuesday, 10:00-17:00. Wednesday, 10:00-19:00. Thursday, 10:00-17:00. Friday, 10:00-22:00. Saturday, 9:00-22:00. Hours can shift for holidays and private events. Check Instagram for the latest.",
      },
      {
        id: "location",
        question: "Where are you located?",
        answer:
          "919 Caroline Street in historic downtown Fredericksburg, VA. Street parking is available on Caroline and nearby blocks. We are a short walk from the train station and most downtown shops.",
      },
      {
        id: "menu",
        question: "What do you serve?",
        answer:
          "Craft espresso, slow-bar pour overs, house pastries, soft-serve cones, and a seasonal cocktail menu on evenings and weekends. The menu rotates. Ask the barista what is pouring today.",
      },
      {
        id: "events",
        question: "How do events and RSVPs work?",
        answer:
          "We host cuppings, listening nights, classes, and openings throughout the month. Most events are free with limited seats. RSVP by email to hold your spot. Walk-ins are welcome when seats remain. See the Events page for what is coming up.",
      },
      {
        id: "artists",
        question: "How does the artist shelf work?",
        answer:
          "Local makers display work at the counter. Seventy percent of every sale goes directly to the artist, paid monthly. Pieces are sold in person only, with no shipping or holds. Interested in joining the shelf? Send five photos and a short intro to artists@curitiba.cafe.",
      },
      {
        id: "wifi",
        question: "Can I work from the café?",
        answer:
          "Absolutely. We have comfortable seating, free Wi-Fi, and plenty of outlets. We ask that laptop users grab a drink and keep conversations at a considerate volume. It is a shared room.",
      },
    ] satisfies FaqItem[],
  },

  chat: {
    title: "Curitiba",
    subtitle: "Ask about the bar",
    placeholder: "Hours, menu, events…",
    disclaimer: "Answers from our menu and hours. Ask at the counter for anything else.",
    greeting:
      "Welcome to Curitiba. Ask about our hours, summer menu, events, or the artist shelf.",
    suggestions: [
      "What are your hours?",
      "What's on the menu?",
      "Upcoming events",
      "Where are you located?",
    ],
    locationAnswer:
      "919 Caroline Street, Historic Downtown Fredericksburg, VA.\n\nTap Visit on the menu for directions, or get directions in Google Maps:\nhttps://www.google.com/maps/dir/?api=1&destination=Curitiba+Art+Caf%C3%A9%2C+919+Caroline+St%2C+Fredericksburg%2C+VA+22401",
  },

  // Pulled from https://linktr.ee/CuritibaArt
  social: [
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/curitiba_art_cafe",
      icon: "instagram",
      external: true,
    },
    {
      id: "tiktok",
      label: "TikTok",
      href: "https://www.tiktok.com/@curitiba_art_cafe",
      icon: "tiktok",
      external: true,
    },
    {
      id: "events",
      label: "Events",
      href: "/events",
      icon: "events",
    },
    {
      id: "press",
      label: "Press",
      href: "https://www.fredericksburgfreepress.com/2025/09/03/forced-to-improvise-jazz-collective-finds-new-arrangement-at-curitiba",
      icon: "press",
      external: true,
    },
  ] satisfies SocialLink[],

  instagram: {
    title: "On Instagram",
    body: "Morning light at the bar, new work on the shelf, and the room between pours - follow along at the cafe.",
    profileUrl: "https://www.instagram.com/curitiba_art_cafe/",
    handle: "curitiba_art_cafe",
    postCount: 6,
    daysWindow: 30,
  },

  reviews: {
    title: "What people say",
    // Live top-5 Google reviews load when GOOGLE_PLACES_API_KEY is set; this
    // textQuery resolves the place. These fallback quotes (real, lightly
    // trimmed) show until the key is wired in - see app/lib/reviews.ts.
    query: "Curitiba Art Café, 919 Caroline St, Fredericksburg, VA 22401",
    rating: 4.4,
    count: 407,
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Curitiba+Art+Caf%C3%A9%2C+919+Caroline+St%2C+Fredericksburg%2C+VA+22401",
    fallback: [
      {
        author: "Twinkletoes",
        rating: 5,
        text: "The barista was very helpful in tailoring my coffee, and there are lots of different places to sit.",
        relativeTime: "",
      },
      {
        author: "ImAlwaysAdventuring",
        rating: 5,
        text: "Really cute cafe nestled in historic downtown Fredericksburg - great atmosphere.",
        relativeTime: "",
      },
      {
        author: "Travelhound",
        rating: 4,
        text: "Great coffee, cool music, comfy couches, friendly service, artsy decor.",
        relativeTime: "",
      },
    ] satisfies ReviewItem[],
  },

  footer: {
    cafe: [
      { href: "/#menu", label: "Menu" },
      { href: "/events", label: "Events" },
      { href: "/#visit", label: "Visit" },
      { href: "/#faq", label: "FAQ" },
    ],
    community: [
      { href: "/artists", label: "Artist shelf" },
      { href: "/artists#sell", label: "Sell with us" },
      { href: "/#newsletter", label: "Newsletter" },
    ],
    follow: [
      { href: "https://www.instagram.com/curitiba_art_cafe", label: "Instagram" },
      { href: "https://www.tiktok.com/@curitiba_art_cafe", label: "TikTok" },
      { href: "/events", label: "Events" },
      {
        href: "https://www.fredericksburgfreepress.com/2025/09/03/forced-to-improvise-jazz-collective-finds-new-arrangement-at-curitiba",
        label: "Press",
      },
    ],
  },

  eventsPage: {
    eyebrow: "The room after hours",
    title: "Events",
    body: "Cuppings, listening nights, classes, and openings - small, hosted with the neighborhood, and almost always with a pour in hand. Seats are limited; RSVP holds yours.",
    rsvpNote:
      "RSVP sends us a short email - we confirm within a day. Most events are free; classes note their price. Walk-ins welcome if seats remain.",
    host: {
      title: "Host your event here",
      body: "After close, the room is yours - the espresso bar stays staffed, the shelf becomes gallery walls, and the sound system is in-house. We host launches, readings, supper clubs, and openings.",
      details: [
        { label: "Capacity", value: "48 seated · 70 standing" },
        { label: "Hours", value: "18:30 - midnight" },
        { label: "Bar", value: "Espresso, filter, or full takeover" },
        { label: "Community rate", value: "Local artists & nonprofits, ask us" },
      ],
    },
  },

  artistsPage: {
    eyebrow: "The artist shelf",
    title: "Local artists",
    body: "Every piece at the counter is made within walking distance of it. Seventy percent of each sale goes directly to the artist - the rest keeps the shelf running.",
    featured: {
      name: "Jaime Rodriguez",
      medium: "Futuro Photography",
      bio: "Jaime Rodriguez captures New York City through Futuro Photography — from 1980s street portraits to legendary jazz nights at The Blue Note. His \"Dizzy\" print comes from his very first concert photography assignment. Original prints are available at the counter.",
      price: "At the counter - from $100",
      imagePlaceholder: "Jaime Rodriguez - Futuro Photography",
    },
    sell: {
      title: "Join the shelf",
      body: "We rotate three makers every quarter. If you live or work in the neighborhood and make something with your hands, send us five photos and a line about yourself. Seventy percent of every sale is yours, paid monthly.",
      cta: "Apply to the shelf",
      ctaHref:
        "mailto:artists@curitiba.cafe?subject=Application%20-%20The%20artist%20shelf",
      note: "Next review - September 2026",
    },
  },
} as const;

const rsvp = (title: string) =>
  `mailto:events@curitiba.cafe?subject=${encodeURIComponent("RSVP - " + title)}`;

export const upcomingEvents: EventItem[] = [
  {
    date: "Thu · Jul 16",
    title: "Cupping at the slow bar",
    detail: "Taste the summer single-origin series with our head roaster.",
    seats: "12 seats · Free",
    rsvpHref: rsvp("Cupping at the slow bar"),
  },
  {
    date: "Sat · Jul 25",
    title: "Listening night: vinyl & filter",
    detail: "A local selector, one turntable, and batch brew until late.",
    seats: "Open room · Free",
    rsvpHref: rsvp("Listening night: vinyl & filter"),
  },
  {
    date: "Fri · Aug 7",
    title: "Artist shelf opening",
    detail: "Meet the next three makers joining the shelf. First pour on us.",
    seats: "Open room · Free",
    rsvpHref: rsvp("Artist shelf opening"),
  },
  {
    date: "Sat · Aug 15",
    title: "Latte art, hands on",
    detail: "A small class at the machine - milk, pitchers, patience.",
    seats: "8 seats · $35",
    rsvpHref: rsvp("Latte art, hands on"),
  },
];

export const pastEvents: PastEvent[] = [
  {
    slotId: "past-1",
    placeholder: "Photo - spring cupping",
    title: "Spring origins cupping",
    date: "April 2026",
  },
  {
    slotId: "past-2",
    placeholder: "Photo - poetry night",
    title: "Reading night: new voices",
    date: "May 2026",
  },
  {
    slotId: "past-3",
    placeholder: "Photo - shelf opening",
    title: "Artist shelf, first hang",
    date: "June 2026",
  },
];

export const shelfArtists: ArtistCard[] = [
  {
    slug: "jaime-rodriguez",
    slotId: "artist-jaime-rodriguez",
    placeholder: "Jaime Rodriguez - Futuro Photography",
    name: "Jaime Rodriguez",
    work: "Photography",
    price: "from $100",
    medium: "Futuro Photography",
    imageUrl: "/assets/artists/jaime-rodriguez/work-3.jpg",
  },
];

export const artistProfiles: Record<string, ArtistProfileData> = {
  "jaime-rodriguez": {
    slug: "jaime-rodriguez",
    name: "Jaime Rodriguez",
    firstName: "Jaime",
    medium: "Futuro Photography",
    price: "from $100",
    since: "July 2026",
    link: "#",
    bio: "Jaime Rodriguez captures New York City through Futuro Photography — from 1980s street portraits to legendary jazz nights at The Blue Note. Original prints, signed and ready to hang.",
    quote: "The image you see is an original print from the moment it happened.",
    portraitPlaceholder: "Jaime Rodriguez - Futuro Photography",
    portraitImageUrl: "/assets/artists/jaime-rodriguez/work-3.jpg",
    works: [
      {
        title: "\"X\" — 1980's New York City",
        price: "$100",
        placeholder: "X print - 1980's New York City",
        imageUrl: "/assets/artists/jaime-rodriguez/work-1.jpg",
      },
      {
        title: "1980's New York City",
        price: "$100",
        placeholder: "1980's New York City - photograph",
        imageUrl: "/assets/artists/jaime-rodriguez/work-2.jpg",
      },
      {
        title: "\"Dizzy\" — Summer 1983, New York City",
        price: "$150",
        placeholder: "Dizzy - Summer 1983, New York City",
        imageUrl: "/assets/artists/jaime-rodriguez/work-3.jpg",
      },
    ],
  },
};

export const artistOrder = ["jaime-rodriguez"] as const;

export function getArtistProfile(slug: string): ArtistProfile | undefined {
  const profile = artistProfiles[slug];
  if (!profile) return undefined;
  return {
    ...profile,
    copy: resolveArtistCopy(
      slug === "jaime-rodriguez"
        ? {
            featuredBio: siteData.artistsPage.featured.bio,
            featuredCta: "View her work",
            featuredPriceLine: siteData.artistsPage.featured.price,
          }
        : undefined,
      {
        price: profile.price,
        since: profile.since,
        firstName: profile.firstName,
        bio: profile.bio,
      },
    ),
  };
}

export function getAdjacentArtists(slug: string) {
  const order = artistOrder as readonly string[];
  const i = order.indexOf(slug);
  if (i === -1) return null;
  const prev = order[(i + order.length - 1) % order.length];
  const next = order[(i + 1) % order.length];
  return {
    prev: { slug: prev, name: artistProfiles[prev].name },
    next: { slug: next, name: artistProfiles[next].name },
  };
}