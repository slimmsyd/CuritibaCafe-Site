import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./cart/CartContext";
import ChatBot from "./components/curitiba/ChatBot";
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

const siteUrl = resolveSiteUrl(siteData.brand.domain);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteData.seo.title,
    template: `%s | ${siteData.brand.name}`,
  },
  description: siteData.seo.description,
  applicationName: siteData.brand.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteData.seo.ogTitle,
    description: siteData.seo.ogDescription,
    type: "website",
    url: siteUrl,
    siteName: siteData.brand.name,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: siteData.brand.logoAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.seo.ogTitle,
    description: siteData.seo.ogDescription,
    images: ["/twitter-image.png"],
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
          <ChatBot />
        </SiteContentProvider>
      </body>
    </html>
  );
}