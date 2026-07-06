"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { siteData } from "@/app/lib/site-data";

type HeaderVariant = "landing" | "events" | "artists" | "artist";

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

function navActive(variant: HeaderVariant, href: string) {
  if (variant === "events" && href === "/events") return true;
  if ((variant === "artists" || variant === "artist") && href === "/artists") return true;
  return false;
}

function ctaForVariant(variant: HeaderVariant) {
  if (variant === "events") {
    return { href: "/events#host", label: "Host an event" };
  }
  if (variant === "artists" || variant === "artist") {
    return { href: "/artists#sell", label: "Sell with us" };
  }
  return null;
}

export default function MobileNav({ variant = "landing" }: { variant?: HeaderVariant }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const cta = ctaForVariant(variant);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-11 w-11 cursor-pointer items-center justify-center text-ink transition-colors hover:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 cursor-pointer bg-ink/40"
            onClick={() => setOpen(false)}
          />
          <nav
            id={panelId}
            className="fixed inset-x-0 top-14 z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-hairline bg-white px-5 py-6 shadow-[0_18px_40px_rgba(17,17,17,0.12)] sm:top-[72px] sm:max-h-[calc(100dvh-4.5rem)]"
          >
            <ul className="flex flex-col gap-1">
              {siteData.nav.map((link) => {
                const active = navActive(variant, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`block min-h-11 py-3 text-[15px] tracking-[0.04em] ${
                        active
                          ? "font-medium text-ink"
                          : "text-ink hover:text-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {variant === "landing" ? (
              <div className="mt-6 flex gap-4 border-t border-hairline pt-6">
                <Link
                  href="#menu"
                  onClick={() => setOpen(false)}
                  className="min-h-11 text-[13px] uppercase tracking-[0.14em] text-ink hover:text-muted"
                >
                  Menu
                </Link>
                <Link
                  href="#visit"
                  onClick={() => setOpen(false)}
                  className="min-h-11 text-[13px] uppercase tracking-[0.14em] text-ink hover:text-muted"
                >
                  Visit
                </Link>
                <Link
                  href="#artists"
                  onClick={() => setOpen(false)}
                  className="min-h-11 text-[13px] uppercase tracking-[0.14em] text-ink hover:text-muted"
                >
                  Shop
                </Link>
              </div>
            ) : null}

            {cta ? (
              <Link
                href={cta.href}
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex min-h-11 items-center border border-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-ink hover:text-muted"
              >
                {cta.label}
              </Link>
            ) : null}
          </nav>
        </>
      ) : null}
    </div>
  );
}