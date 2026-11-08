import { site } from "../content";

/**
 * Absolute origin of the portfolio, without a trailing slash. Order:
 * NEXT_PUBLIC_SITE_URL → Vercel production domain → `site.url` in resume.ts →
 * localhost. Used by metadata, the sitemap, JSON-LD and the PDF.
 */
export function getSiteUrl(): string {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (vercel ? `https://${vercel}` : undefined) ||
    site.url ||
    "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

/** "https://jesus.dev/projects/x" → "jesus.dev/projects/x" (for printed URLs). */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
}
