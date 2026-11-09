import { defaultLocale, locales, type Locale } from "./config";

/**
 * URL structure. English lives at the root, Spanish under /es with translated
 * segments. The folders in src/app must match these names for "projects" and
 * "tutorials"; the other section slugs are served by a dynamic [section] route.
 */
export const sectionKeys = ["about", "experience", "projects", "skills", "certifications", "contact"] as const;
export type SectionKey = (typeof sectionKeys)[number];

export const sectionSlugs: Record<Locale, Record<SectionKey, string>> = {
  en: {
    about: "about",
    experience: "experience",
    projects: "projects",
    skills: "skills",
    certifications: "certifications",
    contact: "contact",
  },
  es: {
    about: "sobre-mi",
    experience: "experiencia",
    projects: "proyectos",
    skills: "habilidades",
    certifications: "certificaciones",
    contact: "contacto",
  },
};

export const tutorialsSlug: Record<Locale, string> = { en: "tutorials", es: "tutoriales" };

/** DOM id of the tutorials block on project pages. Section DOM ids are the SectionKeys. */
export const TUTORIALS_ID = "tutorials";
export const TOP = "top";

export const localePrefix = (locale: Locale) => (locale === defaultLocale ? "" : `/${locale}`);

/** "/" · "/es" · "/experience" · "/es/experiencia" */
export function homePath(locale: Locale, section?: SectionKey | typeof TOP): string {
  const prefix = localePrefix(locale);
  if (!section || section === TOP) return prefix || "/";
  return `${prefix}/${sectionSlugs[locale][section]}`;
}

/** "/projects/caribito" · "/es/proyectos/caribito/tutoriales" */
export function projectPath(locale: Locale, slug: string, tutorials = false): string {
  const base = `${localePrefix(locale)}/${sectionSlugs[locale].projects}/${slug}`;
  return tutorials ? `${base}/${tutorialsSlug[locale]}` : base;
}

export type RouteInfo =
  | { locale: Locale; page: "home"; section: SectionKey | typeof TOP }
  | { locale: Locale; page: "project"; slug: string; tutorials: boolean };

/** Parses any site path back into what it shows. Returns null for unknown paths. */
export function parsePath(pathname: string): RouteInfo | null {
  const parts = pathname.split("/").filter(Boolean);
  let locale: Locale = defaultLocale;
  if (parts[0] && parts[0] !== defaultLocale && locales.includes(parts[0] as Locale)) locale = parts.shift() as Locale;
  const slugs = sectionSlugs[locale];
  if (parts.length === 0) return { locale, page: "home", section: TOP };
  const key = (Object.keys(slugs) as SectionKey[]).find((k) => slugs[k] === parts[0]);
  if (!key) return null;
  if (parts.length === 1) return { locale, page: "home", section: key };
  if (key === "projects" && parts.length <= 3) {
    if (parts.length === 3 && parts[2] !== tutorialsSlug[locale]) return null;
    return { locale, page: "project", slug: parts[1], tutorials: parts.length === 3 };
  }
  return null;
}

/** The same page in another language (used by the language switch). */
export function translatePath(pathname: string, to: Locale): string {
  const route = parsePath(pathname);
  if (!route) return homePath(to);
  return route.page === "home" ? homePath(to, route.section) : projectPath(to, route.slug, route.tutorials);
}
