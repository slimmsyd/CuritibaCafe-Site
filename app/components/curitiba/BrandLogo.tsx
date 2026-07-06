import Image from "next/image";
import Link from "next/link";
import { siteData } from "@/app/lib/site-data";

const SIZES = {
  nav: { height: 44, width: 25 },
  footer: { height: 72, width: 40 },
  compact: { height: 36, width: 20 },
} as const;

export default function BrandLogo({
  size = "nav",
  linked = true,
}: {
  size?: keyof typeof SIZES;
  linked?: boolean;
}) {
  const dims = SIZES[size];
  const image = (
    <Image
      src={siteData.brand.logo}
      alt={siteData.brand.logoAlt}
      width={dims.width}
      height={dims.height}
      className="block h-auto w-auto max-w-none"
      style={{ height: dims.height, width: "auto" }}
      priority={size === "nav"}
    />
  );

  if (!linked) return image;

  return (
    <Link
      href="/"
      aria-label={`${siteData.brand.logoAlt} home`}
      className="inline-flex shrink-0 items-center transition-opacity hover:opacity-80"
    >
      {image}
    </Link>
  );
}