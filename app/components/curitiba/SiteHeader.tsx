import Link from "next/link";
import BrandLogo from "@/app/components/curitiba/BrandLogo";
import MobileNav from "@/app/components/curitiba/MobileNav";
import { siteData } from "@/app/lib/site-data";

type HeaderVariant = "landing" | "events" | "artists" | "artist";

function SearchIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function navActive(variant: HeaderVariant, href: string) {
  if (variant === "events" && href === "/events") return true;
  if (variant === "artists" && href === "/artists") return true;
  if (variant === "artist" && href === "/artists") return true;
  return false;
}

export default function SiteHeader({ variant = "landing" }: { variant?: HeaderVariant }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-hairline bg-white px-5 sm:h-[72px] sm:px-8 lg:px-10">
      <BrandLogo size="nav" />

      <nav className="hidden gap-9 text-[14px] tracking-[0.04em] lg:flex">
        {siteData.nav.map((link) => {
          const active = navActive(variant, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "border-b border-ink pb-0.5 text-ink"
                  : "text-ink hover:text-muted"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {variant === "landing" ? (
        <div className="hidden items-center gap-[22px] text-ink lg:flex">
          <Link href="#menu" aria-label="Search" className="flex hover:text-muted">
            <SearchIcon />
          </Link>
          <Link href="#visit" aria-label="Find us" className="flex hover:text-muted">
            <LocationIcon />
          </Link>
          <Link href="#artists" aria-label="Shop" className="flex hover:text-muted">
            <ShopIcon />
          </Link>
        </div>
      ) : variant === "events" ? (
        <Link
          href="/events#host"
          className="hidden border border-ink px-[22px] py-[10px] text-[12px] font-medium uppercase tracking-[0.16em] text-ink hover:text-muted lg:inline-flex"
        >
          Host an event
        </Link>
      ) : (
        <Link
          href="/artists#sell"
          className="hidden border border-ink px-[22px] py-[10px] text-[12px] font-medium uppercase tracking-[0.16em] text-ink hover:text-muted lg:inline-flex"
        >
          Sell with us
        </Link>
      )}

      <MobileNav variant={variant} />
    </header>
  );
}