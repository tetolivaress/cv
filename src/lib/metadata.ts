import type { Metadata, Viewport } from "next";
import { getContent, getProject, t, type SectionKey } from "../content";
import { localeMeta, locales, type Locale } from "../i18n/config";
import { homePath, projectPath } from "../i18n/routes";
import { getSiteUrl } from "./site-url";

export const ogImagePath = (locale: Locale) => (locale === "en" ? "/og.png" : `/og-${locale}.png`);

/** Shared by both root layouts (English and Spanish). */
export function layoutMetadata(locale: Locale): Metadata {
  const { person, meta } = getContent(locale);
  const siteUrl = getSiteUrl();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: meta.title, template: `%s · ${person.name}` },
    description: meta.description,
    applicationName: person.name,
    authors: [{ name: person.name, url: siteUrl }],
    creator: person.name,
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e0d" },
  ],
};

interface PageMeta {
  locale: Locale;
  /** This page's URL in each language (hreflang). */
  paths: Record<Locale, string>;
  /** Canonical path; defaults to this language's path. */
  canonical?: string;
  title?: string;
  description?: string;
  type?: "website" | "profile" | "article";
}

function pageMetadata({ locale, paths, canonical, title, description, type = "website" }: PageMeta): Metadata {
  const { meta, person } = getContent(locale);
  const ogTitle = title ? `${title} · ${person.name}` : meta.title;
  const desc = description ?? meta.description;
  const image = { url: ogImagePath(locale), width: 1200, height: 630, type: "image/png", alt: `${person.name} — ${person.title}` };
  return {
    ...(title ? { title } : {}),
    description: desc,
    alternates: {
      canonical: canonical ?? paths[locale],
      languages: { ...Object.fromEntries(locales.map((l) => [localeMeta[l].htmlLang, paths[l]])), "x-default": paths.en },
    },
    openGraph: {
      type,
      url: canonical ?? paths[locale],
      siteName: person.name,
      title: ogTitle,
      description: desc,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].ogLocale),
      images: [image],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description: desc, images: [image.url] },
  };
}

const homePaths = () => Object.fromEntries(locales.map((l) => [l, homePath(l)])) as Record<Locale, string>;

export const homeMetadata = (locale: Locale) => pageMetadata({ locale, paths: homePaths(), type: "profile" });

/** Section pages show the home page, so they declare the home page as canonical. */
export function sectionMetadata(locale: Locale, key: SectionKey): Metadata {
  return pageMetadata({ locale, paths: homePaths(), title: getContent(locale).sections[key].nav, type: "profile" });
}

export function projectMetadata(locale: Locale, slug: string, tutorials = false): Metadata {
  const found = getProject(locale, slug);
  if (!found) return {};
  const { project } = found;
  const { ui } = getContent(locale);
  const paths = Object.fromEntries(locales.map((l) => [l, projectPath(l, slug)])) as Record<Locale, string>;
  return pageMetadata({
    locale,
    paths,
    title: tutorials ? t(ui.project.tutorialsTitleMeta, { name: project.name }) : project.name,
    description: project.summary,
    type: "article",
  });
}
