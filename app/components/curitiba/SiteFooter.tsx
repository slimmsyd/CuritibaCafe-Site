import Link from "next/link";
import BrandLogo from "@/app/components/curitiba/BrandLogo";
import { siteData } from "@/app/lib/site-data";

type FooterVariant = "full" | "compact";

export default function SiteFooter({
  variant = "full",
  compactLink = { href: "/#newsletter", label: "Newsletter" },
}: {
  variant?: FooterVariant;
  compactLink?: { href: string; label: string };
}) {
  if (variant === "compact") {
    return (
      <footer className="flex items-center justify-between border-t border-hairline px-10 py-12 text-[12px] tracking-[0.04em] text-faint">
        <BrandLogo size="compact" />
        <span>{siteData.brand.copyright}</span>
        <Link
          href={compactLink.href}
          className="border-b border-ink pb-0.5 text-[12px] uppercase tracking-[0.14em] text-ink hover:text-muted"
        >
          {compactLink.label}
        </Link>
      </footer>
    );
  }

  return (
    <footer className="border-t border-hairline px-10 pb-12 pt-[72px]">
      <div className="mx-auto mb-[72px] flex max-w-[1560px] items-start justify-between">
        <BrandLogo size="footer" />
        <div className="flex gap-24">
          <FooterColumn title="Cafe" links={siteData.footer.cafe} />
          <FooterColumn title="Community" links={siteData.footer.community} />
          <FooterColumn title="Follow" links={siteData.footer.follow} />
        </div>
      </div>
      <div className="mx-auto flex max-w-[1560px] justify-between text-[12px] tracking-[0.04em] text-faint">
        <span>{siteData.brand.copyright}</span>
        <span>{siteData.brand.tagline}</span>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-3.5 text-[13px]">
      <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-faint">
        {title}
      </div>
      {links.map((link) => (
        <Link
          key={`${link.href}-${link.label}`}
          href={link.href}
          className="text-ink hover:text-muted"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}