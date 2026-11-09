import type { MetadataRoute } from "next";
import { getContent } from "@/content";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { homePath, projectPath } from "@/i18n/routes";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

/** Every page in both languages, each listing its translation (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = getSiteUrl();
  const now = new Date();
  const entry = (paths: Record<Locale, string>, priority: number) =>
    locales.map((locale) => ({
      url: `${url}${paths[locale]}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [localeMeta[l].htmlLang, `${url}${paths[l]}`])),
      },
    }));
  const by = (fn: (l: Locale) => string) => Object.fromEntries(locales.map((l) => [l, fn(l)])) as Record<Locale, string>;
  return [
    ...entry(by((l) => homePath(l)), 1),
    ...getContent("en").projects.flatMap((project) => entry(by((l) => projectPath(l, project.slug)), 0.8)),
  ];
}
