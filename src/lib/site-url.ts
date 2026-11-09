import { site } from "../content/resume";

const configured = /^\s*(TODO\b|$)/i.test(site.url) ? undefined : site.url;

/**
 * Absolute origin of the portfolio, without a trailing slash. Order:
 * NEXT_PUBLIC_SITE_URL → Vercel production domain → `site.url` in resume.ts →
 * localhost. Used by metadata, the sitemap, JSON-LD and the PDFs.
 */
export function getSiteUrl(): string {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const url =
    process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : undefined) || configured || "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

/** "https://jesus.dev/projects/x" → "jesus.dev/projects/x" (for printed URLs). */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
}
