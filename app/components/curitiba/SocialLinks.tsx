import Link from "next/link";
import type { SocialLink } from "@/app/lib/site-data";
import { siteData } from "@/app/lib/site-data";
import SocialIcon from "./SocialIcon";

type Variant = "hero" | "footer";

function SocialAnchor({
  link,
  variant,
}: {
  link: SocialLink;
  variant: Variant;
}) {
  const external = link.external ?? link.href.startsWith("http");
  const className =
    variant === "hero"
      ? "pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-white/12 text-white backdrop-blur-[2px] transition-colors hover:border-white hover:bg-white/22 hover:text-white"
      : "flex items-center gap-3 text-ink transition-colors hover:text-muted";

  const content =
    variant === "hero" ? (
      <SocialIcon icon={link.icon} size={17} />
    ) : (
      <>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-sand text-ink">
          <SocialIcon icon={link.icon} size={15} />
        </span>
        <span>{link.label}</span>
      </>
    );

  if (external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={link.label}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} aria-label={link.label} className={className}>
      {content}
    </Link>
  );
}

export default function SocialLinks({
  links = siteData.social,
  variant = "footer",
  className = "",
}: {
  links?: readonly SocialLink[];
  variant?: Variant;
  className?: string;
}) {
  if (variant === "hero") {
    return (
      <div className={`flex max-w-[calc(100vw-2.5rem)] flex-wrap items-center justify-center gap-2.5 sm:gap-3 ${className}`}>
        {links.map((link) => (
          <SocialAnchor key={link.id} link={link} variant="hero" />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3.5 text-[13px] ${className}`}>
      {links.map((link) => (
        <SocialAnchor key={link.id} link={link} variant="footer" />
      ))}
    </div>
  );
}