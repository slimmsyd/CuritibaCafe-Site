import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./cart/CartContext";
import IntroLoader from "./components/curitiba/IntroLoader";
import { SiteContentProvider } from "./lib/site-content";
import { getSiteContent } from "./lib/content";
import { siteData } from "./lib/site-data";
import { resolveSiteUrl } from "./lib/site-url";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(resolveSiteUrl(siteData.brand.domain)),
  title: siteData.seo.title,
  description: siteData.seo.description,
  openGraph: {
    title: siteData.seo.ogTitle,
    description: siteData.seo.ogDescription,
    type: "website",
    url: resolveSiteUrl(siteData.brand.domain),
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.seo.ogTitle,
    description: siteData.seo.ogDescription,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteContent();

  return (
    <html lang="en" className={`${hanken.variable} h-full antialiased`}>
      <body className="min-h-full">
        <IntroLoader />
        <SiteContentProvider content={site}>
          <CartProvider maxQty={site.product.maxQty}>{children}</CartProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}