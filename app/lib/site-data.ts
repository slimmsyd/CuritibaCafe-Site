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

export type ArtistProfile = {
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

export type PastEvent = {
  slotId: string;
  placeholder: string;
  title: string;
  date: string;
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
        slug: "marina",
        slotId: "artist-1",
        placeholder: "Ceramics - artist photo",
        name: "Marina Duarte",
        work: "Hand-thrown cups",
        price: "from $38",
        medium: "Ceramics",
      },
      {
        slug: "theo",
        slotId: "artist-2",
        placeholder: "Prints - artist photo",
        name: "Theo Almeida",
        work: "Risograph prints",
        price: "from $24",
        medium: "Riso prints",
      },
      {
        slug: "june",
        slotId: "artist-3",
        placeholder: "Textiles - artist photo",
        name: "June Okafor",
        work: "Woven table runners",
        price: "from $65",
        medium: "Textiles",
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
      id: "website",
      label: "Website",
      href: "https://www.curitibaartcafe.com/",
      icon: "website",
      external: true,
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
      { href: "https://www.curitibaartcafe.com/", label: "Website" },
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
      name: "Marina Duarte",
      medium: "Ceramics - hand-thrown cups & pour-over sets",
      bio: "Marina throws every cup in her studio two blocks from the cafe, glazing in the same warm sand tones as the room. Her demitasse set is what our espresso is served in - the shelf carries the same pieces, numbered and signed.",
      price: "At the counter - from $38",
      imagePlaceholder: "Featured artist - portrait or work in progress",
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
    slug: "marina",
    slotId: "artist-marina",
    placeholder: "Marina - ceramics",
    name: "Marina Duarte",
    work: "Hand-thrown cups",
    price: "from $38",
    medium: "Ceramics",
  },
  {
    slug: "theo",
    slotId: "artist-theo",
    placeholder: "Theo - riso prints",
    name: "Theo Almeida",
    work: "Risograph prints",
    price: "from $24",
    medium: "Riso prints",
  },
  {
    slug: "june",
    slotId: "artist-june",
    placeholder: "June - textiles",
    name: "June Okafor",
    work: "Woven table runners",
    price: "from $65",
    medium: "Textiles",
  },
  {
    slug: "rafa",
    slotId: "artist-rafa",
    placeholder: "Rafa - photography",
    name: "Rafa Lindgren",
    work: "Photography",
    price: "from $45",
    medium: "Photography",
  },
  {
    slug: "carmen",
    slotId: "artist-carmen",
    placeholder: "Carmen - jewelry",
    name: "Carmen Ito",
    work: "Jewelry",
    price: "from $52",
    medium: "Jewelry",
  },
  {
    slug: "dev",
    slotId: "artist-dev",
    placeholder: "Dev - woodwork",
    name: "Dev Ansari",
    work: "Woodwork",
    price: "from $30",
    medium: "Woodwork",
  },
  {
    slug: "lena",
    slotId: "artist-lena",
    placeholder: "Lena - zines",
    name: "Lena Moraes",
    work: "Zines & books",
    price: "from $12",
    medium: "Zines & books",
  },
  {
    slug: "oto",
    slotId: "artist-oto",
    placeholder: "Oto - candles",
    name: "Oto Kamau",
    work: "Candles",
    price: "from $22",
    medium: "Candles",
  },
];

export const artistProfiles: Record<string, ArtistProfile> = {
  marina: {
    slug: "marina",
    name: "Marina Duarte",
    firstName: "Marina",
    medium: "Ceramics",
    price: "from $38",
    since: "January 2026",
    link: "#",
    bio: "Marina throws every cup in her studio two blocks from the cafe, glazing in the same warm sand tones as the room. Her demitasse set is what our espresso is served in.",
    quote: "A cup should feel like it was always yours.",
    portraitPlaceholder: "Marina - portrait or studio shot",
    works: [
      { title: "Demitasse pair", price: "$38", placeholder: "Demitasse pair - photo" },
      { title: "Pour-over set", price: "$120", placeholder: "Pour-over set - photo" },
      { title: "Numbered mug", price: "$46", placeholder: "Numbered mug - photo" },
    ],
  },
  theo: {
    slug: "theo",
    name: "Theo Almeida",
    firstName: "Theo",
    medium: "Risograph prints",
    price: "from $24",
    since: "March 2026",
    link: "#",
    bio: "Theo prints two-color risographs of the district - its corners, kiosks, and morning lines. Each run is 50 copies, numbered by hand.",
    quote: "The neighborhood is the archive.",
    portraitPlaceholder: "Theo - portrait or print studio",
    works: [
      { title: "Mercer St, 7am", price: "$24", placeholder: "Mercer St, 7am - photo" },
      { title: "The kiosk series", price: "$24", placeholder: "The kiosk series - photo" },
      { title: "Old Market triptych", price: "$60", placeholder: "Old Market triptych - photo" },
    ],
  },
  june: {
    slug: "june",
    name: "June Okafor",
    firstName: "June",
    medium: "Textiles",
    price: "from $65",
    since: "January 2026",
    link: "#",
    bio: "June weaves runners and coasters in undyed cotton on a floor loom, working in small seasonal batches.",
    quote: "Slow cloth, like slow coffee, rewards patience.",
    portraitPlaceholder: "June - portrait or loom",
    works: [
      { title: "Table runner", price: "$65", placeholder: "Table runner - photo" },
      { title: "Coaster set of four", price: "$40", placeholder: "Coaster set of four - photo" },
      { title: "Wall hanging", price: "$140", placeholder: "Wall hanging - photo" },
    ],
  },
  rafa: {
    slug: "rafa",
    name: "Rafa Lindgren",
    firstName: "Rafa",
    medium: "Photography",
    price: "from $45",
    since: "April 2026",
    link: "#",
    bio: "Rafa shoots the cafe's regulars and the district's storefronts on medium-format film, printed at a lab down the street.",
    quote: "Everyone here has a portrait waiting.",
    portraitPlaceholder: "Rafa - portrait or contact sheet",
    works: [
      { title: "Regulars, vol. 1", price: "$45", placeholder: "Regulars, vol. 1 - photo" },
      { title: "Storefront studies", price: "$45", placeholder: "Storefront studies - photo" },
      { title: "Framed 11×14", price: "$95", placeholder: "Framed 11×14 - photo" },
    ],
  },
  carmen: {
    slug: "carmen",
    name: "Carmen Ito",
    firstName: "Carmen",
    medium: "Jewelry",
    price: "from $52",
    since: "April 2026",
    link: "#",
    bio: "Carmen casts small-batch silver pieces in her home studio, finishing each by hand at the bench.",
    quote: "Small objects carry the biggest days.",
    portraitPlaceholder: "Carmen - portrait or bench",
    works: [
      { title: "Bean pendant", price: "$52", placeholder: "Bean pendant - photo" },
      { title: "Hammered band", price: "$68", placeholder: "Hammered band - photo" },
      { title: "Ear studs, pair", price: "$56", placeholder: "Ear studs, pair - photo" },
    ],
  },
  dev: {
    slug: "dev",
    name: "Dev Ansari",
    firstName: "Dev",
    medium: "Woodwork",
    price: "from $30",
    since: "June 2026",
    link: "#",
    bio: "Dev turns offcuts from local workshops into scoops, boards, and trivets - nothing new is felled for the shelf.",
    quote: "The wood was already here. I just listen to it.",
    portraitPlaceholder: "Dev - portrait or workshop",
    works: [
      { title: "Coffee scoop", price: "$30", placeholder: "Coffee scoop - photo" },
      { title: "Serving board", price: "$75", placeholder: "Serving board - photo" },
      { title: "Trivet set", price: "$48", placeholder: "Trivet set - photo" },
    ],
  },
  lena: {
    slug: "lena",
    name: "Lena Moraes",
    firstName: "Lena",
    medium: "Zines & books",
    price: "from $12",
    since: "June 2026",
    link: "#",
    bio: "Lena writes and staples quarterly zines about the neighborhood - interviews, recipes, and walking routes.",
    quote: "Print small, mean it more.",
    portraitPlaceholder: "Lena - portrait or zine spread",
    works: [
      { title: "Issue 04: Mornings", price: "$12", placeholder: "Issue 04: Mornings - photo" },
      { title: "Back-issue bundle", price: "$30", placeholder: "Back-issue bundle - photo" },
      { title: "Walking routes map", price: "$14", placeholder: "Walking routes map - photo" },
    ],
  },
  oto: {
    slug: "oto",
    name: "Oto Kamau",
    firstName: "Oto",
    medium: "Candles",
    price: "from $22",
    since: "June 2026",
    link: "#",
    bio: "Oto pours soy candles scented from the roastery's own notes - cascara, cedar, and toasted sugar.",
    quote: "The room should smell like it sounds.",
    portraitPlaceholder: "Oto - portrait or pouring",
    works: [
      { title: "Cascara, 8oz", price: "$22", placeholder: "Cascara, 8oz - photo" },
      { title: "Cedar & sugar, 8oz", price: "$22", placeholder: "Cedar & sugar, 8oz - photo" },
      { title: "Trio gift set", price: "$58", placeholder: "Trio gift set - photo" },
    ],
  },
};

export const artistOrder = [
  "marina",
  "theo",
  "june",
  "rafa",
  "carmen",
  "dev",
  "lena",
  "oto",
] as const;

export function getArtistProfile(slug: string): ArtistProfile | undefined {
  return artistProfiles[slug];
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