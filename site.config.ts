/**
 * site.config.ts - single source of truth for CuritibaSite.
 *
 * Rebrand the whole site by editing this one file, then dropping your assets
 * into /public (see assets.md). Pricing lives here in CENTS so the server
 * (the Stripe PaymentIntent route) is the only pricing authority - the client
 * never decides what to charge.
 */

export type NavLink = { href: string; label: string };
export type SocialLink = { label: string; href: string };

export type SiteConfig = {
  brand: {
    /** Shown in copyright, aria labels, social card fallbacks. */
    siteName: string;
    /** Bare domain, e.g. "yourbook.com" - shown in footer + used for SEO URL. */
    domain: string;
    /** Logo image in /public (PNG/JPG/SVG). Rendered in the header + checkout. */
    logo: string;
    logoAlt: string;
    /** Stripe Elements appearance, mapped from the Tailwind tokens in globals.css. */
    stripeAppearance: {
      theme: "stripe" | "night" | "flat";
      variables: Record<string, string>;
    };
  };

  product: {
    title: string;
    author: string;
    /** e.g. "Paperback", "Hardcover", "Digital + Print". */
    format: string;
    /** Price per unit, in the smallest currency unit (cents). */
    priceCents: number;
    /** ISO currency code, lowercase for Stripe (e.g. "usd"). */
    currency: string;
    /** Flat shipping fee in cents (0 for digital products). */
    shipFlatCents: number;
    /** Subtotal (cents) at/above which shipping is free. Set very high to disable. */
    freeShipThresholdCents: number;
    /** Hard cap on quantity per order. */
    maxQty: number;
    /** Still cover image in /public. */
    coverImage: string;
    coverAlt: string;
    /** Optional hover/scroll preview video in /public. Empty string = none. */
    hoverVideo: string;
    /** One-line tag shown as a pill on the landing page. */
    tagline: string;
    /** Short marketing line under the title. */
    shortDescription: string;
    /** Longer body paragraphs for the "about the book" section. */
    longDescription: string[];
    /** Small hashtag-style chips under the book. */
    tags: string[];
  };

  nav: NavLink[];
  footer: { links: NavLink[] };
  social: SocialLink[];

  copy: {
    hero: {
      byline: string;
      /** Headline lines - each entry renders on its own line. */
      headline: string[];
      /** Full-bleed background slides (cross-fade carousel) from /public. */
      slides: string[];
      sub: string;
      primaryCta: { label: string; href: string };
      secondaryCta: { label: string; href: string };
    };
    quote: {
      eyebrow: string;
      text: string;
      /** Optional highlighted clause appended to the quote (gold). */
      highlight: string;
      attribution: string;
    };
    aboutBook: {
      eyebrow: string;
      headline: string;
      metaLine: string;
      body: string[];
      ctaLabel: string;
    };
    aboutAuthor: {
      eyebrow: string;
      headline: string;
      metaLine: string;
      body: string[];
      image: string;
      imageAlt: string;
      cta: { label: string; href: string };
      /** Optional "Listen" chips (songs, playlists, talks). Empty = section hidden. */
      songsLabel: string;
      songs: { label: string; href: string }[];
    };
    freeChapter: {
      eyebrow: string;
      headline: string;
      body: string;
      placeholder: string;
      submitLabel: string;
      successTitle: string;
      successBody: string;
      finePrint: string;
      /** Resend notification copy - editable in the admin CRM. */
      emails: {
        welcome: {
          subject: string;
          headline: string;
          body: string;
          signOff: string;
          footer: string;
        };
        admin: {
          subject: string;
          headline: string;
          body: string;
        };
      };
    };
    community: {
      eyebrow: string;
      headline: string;
      body: string;
      photos: { caption: string; image: string }[];
    };
    checkout: {
      summaryItemSubtitle: string;
      summaryItemNote: string;
      shippingNote: string;
      successTitle: string;
      successBody: string;
      /** Resend notification copy - editable in the admin CRM. */
      emails: {
        customer: {
          subject: string;
          headline: string;
          body: string;
          signOff: string;
          footer: string;
        };
        admin: {
          subject: string;
          headline: string;
          body: string;
        };
      };
    };
  };

  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
};

export const site: SiteConfig = {
  brand: {
    siteName: "CuritibaSite",
    domain: "curitibasite.com",
    logo: "/placeholder/logo.svg",
    logoAlt: "CuritibaSite logo",
    stripeAppearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#2d6a4f", // --color-gold
        colorBackground: "#f2f6f0", // --color-paper
        colorText: "#141a16", // --color-ink
        colorTextSecondary: "#3d4a42", // --color-ink-soft
        colorDanger: "#b3261e",
        borderRadius: "8px",
        fontFamily: "system-ui, sans-serif",
      },
    },
  },

  product: {
    title: "Curitiba: A City in Motion",
    author: "Ana Ribeiro",
    format: "Paperback + Digital",
    priceCents: 2799,
    currency: "usd",
    shipFlatCents: 599,
    freeShipThresholdCents: 5000,
    maxQty: 10,
    coverImage: "/placeholder/cover.svg",
    coverAlt: "Curitiba: A City in Motion - cover",
    hoverVideo: "",
    tagline: "Urban stories from Brazil's green capital",
    shortDescription:
      "A photographic journey through Curitiba's parks, transit, architecture, and the people who shaped a model city.",
    longDescription: [
      "Curitiba: A City in Motion traces how a mid-sized Brazilian city became a global reference for sustainable urban planning - from the first bus rapid transit lanes to the botanical gardens that anchor everyday life.",
      "Written for travelers, planners, and anyone curious about cities that work, this book pairs street-level storytelling with archival research. The question it keeps asking: what can we borrow from Curitiba, and what must we adapt?",
    ],
    tags: ["#curitiba", "#urbanism", "#brazil", "#travel"],
  },

  nav: [
    { href: "#book", label: "The Book" },
    { href: "#author", label: "The Author" },
    { href: "#art", label: "Gallery" },
    { href: "#chapter", label: "Free Chapter" },
  ],

  footer: {
    links: [
      { href: "#book", label: "The Book" },
      { href: "#author", label: "The Author" },
      { href: "#chapter", label: "Free Chapter" },
    ],
  },

  social: [
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],

  copy: {
    hero: {
      byline: "A new book by Ana Ribeiro",
      headline: ["Curitiba", "A City in Motion"],
      slides: [
        "/placeholder/hero-1.svg",
        "/placeholder/hero-2.svg",
        "/placeholder/hero-3.svg",
      ],
      sub: "Walk the parks, ride the linha verde, and meet the planners and residents who turned Curitiba into a laboratory for livable cities.",
      primaryCta: { label: "Get the first chapter free", href: "#chapter" },
      secondaryCta: { label: "Explore the book", href: "#book" },
    },
    quote: {
      eyebrow: "From the book",
      text: "A city is not built in a single plan - it is negotiated",
      highlight: "every morning on the bus, in the market, under the araucária trees.",
      attribution: "Chapter 2 · Curitiba: A City in Motion",
    },
    aboutBook: {
      eyebrow: "The book",
      headline: "Stories from the world's greenest capital.",
      metaLine: "10 chapters · 120 photographs",
      body: [
        "Each chapter follows one thread of Curitiba's identity - transit, public space, food, design, and the immigrant communities that built the city. Maps, timelines, and full-page photography anchor every section.",
        "The book draws on interviews with urban planners, bus drivers, gardeners, and longtime residents. It ends not with a blueprint to copy, but with a question: how does your city move?",
      ],
      ctaLabel: "Read the first chapter",
    },
    aboutAuthor: {
      eyebrow: "The author",
      headline: "Ana Ribeiro - journalist and urban storyteller.",
      metaLine: "Writer · Curitiba native",
      body: [
        "Ana Ribeiro grew up riding the Linha Verde and reporting on city hall for a local daily. Her work on transit equity and public space has appeared in magazines across Latin America.",
        "She wrote Curitiba: A City in Motion for readers who love cities as much as destinations - a book that invites you to look closely at how a place actually works.",
      ],
      image: "/placeholder/author.svg",
      imageAlt: "Portrait of Ana Ribeiro",
      cta: { label: "Get the first chapter free", href: "#chapter" },
      songsLabel: "Listen",
      songs: [],
    },
    freeChapter: {
      eyebrow: "Free chapter",
      headline: "Start in the Jardim Botânico - free.",
      body: "Join the list and we'll send the opening chapter straight to your inbox.",
      placeholder: "Your email address",
      submitLabel: "Send me the chapter",
      successTitle: "Obrigado.",
      successBody: "Check your inbox - your free chapter is on its way.",
      finePrint: "No spam. One chapter, then occasional notes from CuritibaSite.",
      emails: {
        welcome: {
          subject: "Your free chapter is on its way",
          headline: "Welcome to CuritibaSite.",
          body: "You're on the list. We'll send the opening chapter straight to this inbox shortly.\n\nSmall enough to begin today. Deep enough to return to for a lifetime.",
          signOff: "With warmth,\nAna Ribeiro & the CuritibaSite team",
          footer:
            "No spam - one chapter, then the occasional note. If you didn't request this, you can safely ignore this email.",
        },
        admin: {
          subject: "New signup - CuritibaSite free chapter",
          headline: "Someone joined the list",
          body: "A new reader signed up for the free chapter. Their welcome email has been sent automatically and the address is saved to the subscriber list.",
        },
      },
    },
    community: {
      eyebrow: "Beyond the book",
      headline: "The city beyond the page.",
      body: "CuritibaSite is more than a book - it's a growing archive of urban stories, walking routes, and reader-submitted photographs from across Paraná.",
      photos: [
        { caption: "Jardim Botânico at dawn", image: "" },
        { caption: "Linha Verde at rush hour", image: "" },
        { caption: "Sunday market in Batel", image: "" },
      ],
    },
    checkout: {
      summaryItemSubtitle: "Paperback + Digital · by Ana Ribeiro",
      summaryItemNote: "Includes free first chapter",
      shippingNote: "Free shipping on orders over $50",
      successTitle: "Thank you. Your order is confirmed.",
      successBody:
        "A confirmation is on its way to your inbox. Your book will ship shortly - and your digital copy is ready now.",
      emails: {
        customer: {
          subject: "Your CuritibaSite order is confirmed",
          headline: "Thank you. Your order is in.",
          body: "We've received your order and are preparing it for shipping. Your full order details are below.",
          signOff: "With warmth,\nAna Ribeiro & the CuritibaSite team",
          footer:
            "Questions about your order? Just reply to this email. If you didn't place this order, please contact us right away.",
        },
        admin: {
          subject: "New order - CuritibaSite",
          headline: "New order received",
          body: "A customer has completed checkout. Fulfillment details are below. The order is also recorded in the admin CRM.",
        },
      },
    },
  },

  seo: {
    title: "Curitiba: A City in Motion - by Ana Ribeiro",
    description:
      "Urban stories and photography from Brazil's green capital. Read the first chapter free.",
    ogTitle: "Curitiba: A City in Motion",
    ogDescription:
      "Walk Curitiba's parks, transit, and public spaces. Read the first chapter free.",
  },
};

export default site;
