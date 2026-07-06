import Link from "next/link";
import BrandLogo from "@/app/components/curitiba/BrandLogo";
import SocialLinks from "@/app/components/curitiba/SocialLinks";
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
      <footer className="flex flex-col items-start gap-6 border-t border-hairline px-5 py-10 text-[12px] tracking-[0.04em] text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-12 lg:px-10">
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
    <footer className="border-t border-hairline px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-16 lg:px-10 lg:pt-[72px]">
      <div className="mx-auto mb-12 flex max-w-[1560px] flex-col gap-12 sm:mb-16 lg:mb-[72px] lg:flex-row lg:items-start lg:justify-between">
        <BrandLogo size="footer" />
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:flex lg:gap-24">
          <FooterColumn title="Cafe" links={siteData.footer.cafe} />
          <FooterColumn title="Community" links={siteData.footer.community} />
          <div className="flex flex-col gap-3.5 text-[13px] sm:col-span-2 lg:col-span-1">
            <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-faint">
              Follow
            </div>
            <SocialLinks variant="footer" />
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1560px] flex-col gap-3 text-[12px] tracking-[0.04em] text-faint sm:flex-row sm:justify-between">
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
          className="min-h-8 text-ink hover:text-muted"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}