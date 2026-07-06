/** Canonical public origin for metadata, Stripe return URLs, and email links. */
export function resolveSiteUrl(domain: string): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || undefined;
  const isLocalhost =
    !configured ||
    configured.includes("localhost") ||
    configured.includes("127.0.0.1");

  if (configured && !isLocalhost) return configured;
  if (process.env.NODE_ENV === "production") {
    const normalizedDomain = domain?.trim();
    if (normalizedDomain) return `https://${normalizedDomain}`;
  }
  return configured ?? "http://localhost:3000";
}
