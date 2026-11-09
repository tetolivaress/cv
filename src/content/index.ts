/**
 * Clean, typed, single-language view of `resume.ts` + `copy.ts`.
 * Server components and the PDF script call `getContent(locale)`. Client
 * components never import this module (so the data is not bundled twice);
 * they receive what they need through `SiteProvider` (see getSiteClient).
 */
import { locales, type Locale } from "../i18n/config";
import { homePath, sectionKeys, type SectionKey } from "../i18n/routes";
import { copy } from "./copy";
import { countWord, isPresent, parseDate, sortKey, t } from "./format";
import * as raw from "./resume";
import type {
  CertCategory,
  Certification,
  Education,
  Era,
  Experience,
  L,
  Language,
  Links,
  Person,
  Project,
  ProjectStory,
  SkillGroupData,
  Video,
} from "./types";

export type * from "./types";
export { t } from "./format";
export type { SectionKey };

// ───────────────────────── helpers ─────────────────────────

const TODO = /^\s*TODO\b/i;

export function isMissing(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "" || TODO.test(value);
  return false;
}

const isLocalized = (value: unknown): value is Record<Locale, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value) && locales.every((l) => l in value);

/** Warnings collector for one language. Messages for shared (non-translated) fields have no tag. */
class Warnings {
  readonly list: string[] = [];
  constructor(private readonly locale: Locale) {}
  add(where: string, localized: boolean) {
    this.list.push(localized ? `[${this.locale}] ${where}` : where);
  }
}

function makeResolver(locale: Locale, warnings: Warnings) {
  /** Picks the language; returns undefined (and warns) for empty/TODO values. */
  function text(value: L<string> | undefined, where: string, warn = true): string | undefined {
    const localized = isLocalized(value);
    const picked = localized ? (value as Record<Locale, string>)[locale] : (value as string | undefined);
    if (isMissing(picked)) {
      if (warn) warnings.add(where, localized);
      return undefined;
    }
    return picked;
  }
  function list(value: L<string[]> | L<string>[] | undefined, where: string): string[] {
    if (isLocalized(value)) {
      const picked = (value as Record<Locale, string[]>)[locale] ?? [];
      const kept = picked.filter((v) => !isMissing(v));
      if (kept.length !== picked.length || picked.length === 0) warnings.add(where, true);
      return kept;
    }
    const items = (value as L<string>[] | undefined) ?? [];
    const kept = items.map((item, i) => text(item, `${where}[${i}]`)).filter((v): v is string => !!v);
    return kept;
  }
  return { text, list };
}

const plain = (value: string | undefined) => (isMissing(value) ? undefined : value);

/** True when a (possibly localized) list has at least one entry in some language. */
const hasItems = (value: L<string[]> | undefined) =>
  !!value && (Array.isArray(value) ? value.length > 0 : Object.values(value).some((items) => items.length > 0));

// ───────────────────────── content per language ─────────────────────────

function build(locale: Locale) {
  const warnings = new Warnings(locale);
  const { text, list } = makeResolver(locale, warnings);
  const c = copy[locale];
  const ui = c.ui;

  // person
  const p = raw.person;
  const links: Links = {};
  for (const key of Object.keys(p.links) as (keyof Links)[]) {
    const value = plain(p.links[key]);
    if (value) links[key] = value;
    else warnings.add(`person.links.${key}`, false);
  }
  const person: Person = {
    name: p.name,
    shortName: p.shortName,
    initials: p.initials,
    title: text(p.title, "person.title") ?? "",
    tagline: text(p.tagline, "person.tagline") ?? "",
    location: text(p.location, "person.location") ?? "",
    workMode: text(p.workMode, "person.workMode", false),
    availability: text(p.availability, "person.availability", false),
    email: p.email,
    photo: plain(p.photo),
    photoFocus: plain(p.photoFocus),
    links,
    summary: text(p.summary, "person.summary") ?? "",
    languages: p.languages
      .map<Language | undefined>((l, i) => {
        const name = text(l.name, `person.languages[${i}].name`);
        if (!name) return undefined;
        return {
          name,
          level: text(l.level, `person.languages[${i}].level`) ?? "",
          cefr: plain(l.cefr),
          native: l.native,
          note: text(l.note, `person.languages[${i}].note`, false),
        };
      })
      .filter((l): l is Language => !!l),
  };

  const eras: Era[] = raw.eras.map((era) => ({ ...era, label: text(era.label, `eras[${era.id}].label`) ?? "" }));

  const experience: Experience[] = raw.experience.map((job, i) => {
    const company = plain(job.company);
    if (!company) warnings.add(`experience[${i}]: company`, false);
    const label = `experience[${i}] ${company ?? ""}`.trim();
    const start = plain(job.start);
    const end = plain(job.end);
    if (!start) warnings.add(`${label}: start date`, false);
    if (!end) warnings.add(`${label}: end date`, false);
    const projects = (job.projects ?? []).map((p, j) => {
      const where = `${label}: projects[${j}]`;
      return {
        name: text(p.name, `${where}.name`) ?? "",
        start: plain(p.start),
        end: plain(p.end),
        highlights: list(p.highlights, `${where}.highlights`),
        stack: list(p.stack ?? [], `${where}.stack`),
      };
    });
    return {
      company,
      role: text(job.role, `${label}: role`) ?? "",
      start,
      end,
      remote: job.remote,
      era: job.era,
      // An employer whose bullets all live in its projects has no highlights of its own.
      highlights: projects.length && !hasItems(job.highlights) ? [] : list(job.highlights, `${label}: highlights`),
      stack: list(job.stack, `${label}: stack`),
      projects,
    };
  });

  const projects: Project[] = raw.projects.map((project, i) => {
    const label = `projects[${i}] ${project.name}`;
    const videos: Video[] = [];
    project.videos.forEach((video, v) => {
      const id = plain(video.youtubeId);
      if (!id) return warnings.add(`${label}: videos[${v}].youtubeId`, false);
      videos.push({ youtubeId: id, duration: plain(video.duration), title: text(video.title, `${label}: videos[${v}].title`) ?? project.name });
    });
    const step = (s: { title: L<string>; text: L<string> } | undefined, name: string) =>
      s ? { title: text(s.title, `${label}: story.${name}.title`) ?? "", text: text(s.text, `${label}: story.${name}.text`) ?? "" } : undefined;
    const story: ProjectStory | undefined = project.story
      ? {
          problem: step(project.story.problem, "problem"),
          solution: step(project.story.solution, "solution"),
          result: project.story.result
            ? {
                ...step(project.story.result, "result")!,
                metrics: project.story.result.metrics?.map((m) => ({ value: m.value, label: text(m.label, `${label}: metric`) ?? "" })),
              }
            : undefined,
        }
      : undefined;
    return {
      slug: project.slug,
      name: project.name,
      url: project.url,
      summary: text(project.summary, `${label}: summary`) ?? "",
      description: text(project.description, `${label}: description`, false),
      role: text(project.role, `${label}: role`),
      dates: text(project.dates, `${label}: dates`, false),
      platform: text(project.platform, `${label}: platform`, false),
      stack: list(project.stack, `${label}: stack`),
      cover: plain(project.cover),
      videos,
      images: project.images
        .filter((img) => !isMissing(img.src))
        .map((img, n) => ({ src: img.src, alt: text(img.alt, `${label}: images[${n}].alt`) ?? project.name })),
      story,
    };
  });

  const skills: SkillGroupData[] = raw.skills
    .map((g, i) => ({ group: text(g.group, `skills[${i}].group`) ?? "", items: list(g.items, `skills[${i}]`) }))
    .filter((g) => g.group && g.items.length > 0);

  const education: Education[] = raw.education
    .map((e, i) => ({ degree: text(e.degree, `education[${i}].degree`) ?? "", school: e.school, year: e.year }))
    .filter((e) => e.degree);

  const certifications: Certification[] = raw.certifications
    .map((cert, i) => {
      const missing = (["date", "credentialUrl", "image"] as const).filter((k) => isMissing(cert[k]));
      const name = text(cert.name, `certifications[${i}] ${cert.issuer}: name`) ?? "";
      const englishName = isLocalized(cert.name) ? (cert.name as Record<Locale, string>).en : cert.name;
      if (missing.length) warnings.add(`certifications[${i}] ${cert.issuer} — ${englishName}: ${missing.join(", ")}`, false);
      return {
        key: `${cert.category}-${i}`,
        category: cert.category,
        name,
        issuer: cert.issuer,
        date: plain(cert.date),
        credentialUrl: plain(cert.credentialUrl),
        image: plain(cert.image),
        featured: cert.featured,
        order: i,
      };
    })
    // Newest first; undated ones keep their order at the end.
    .sort((a, b) => sortKey(b.date) - sortKey(a.date) || a.order - b.order)
    .map(({ order: _order, ...cert }) => cert);

  // The PDF and the hero stats count every certificate; on the site, English ones have their own section.
  const featuredCertifications = (() => {
    const featured = certifications.filter((cert) => cert.featured);
    return featured.length ? featured : certifications.slice(0, 4);
  })();
  const englishCertifications = certifications.filter((cert) => cert.category === "English");
  const galleryCertifications = certifications.filter((cert) => cert.category !== "English");
  const galleryFeatured = (() => {
    const featured = galleryCertifications.filter((cert) => cert.featured);
    return featured.length ? featured : galleryCertifications.slice(0, 4);
  })();

  const yearsOf = (certs: Certification[]) => certs.map((cert) => parseDate(cert.date)?.year).filter((y): y is number => !!y);
  const yearRange = (years: number[]) =>
    years.length ? (Math.min(...years) === Math.max(...years) ? String(years[0]) : `${Math.min(...years)} — ${Math.max(...years)}`) : "";
  const certYearRange = yearRange(yearsOf(galleryCertifications));
  const englishYearRange = yearRange(yearsOf(englishCertifications));

  const startYears = experience.map((job) => parseDate(job.start)?.year).filter((y): y is number => !!y);
  const careerStartYear = Math.min(...startYears);
  const yearsOfExperience = new Date().getFullYear() - careerStartYear;
  const currentJob = experience.find((job) => isPresent(job.end));

  /** "Spanish native · English B2" / "Español nativo · Inglés B2" */
  const languagesLine = person.languages
    .map((l) => (l.cefr && !l.native ? `${l.name} ${l.cefr}` : `${l.name} ${l.level.toLowerCase()}`))
    .join(" · ");

  const stats = [
    { value: `${yearsOfExperience}+`, label: ui.stats.years },
    { value: String(experience.length), label: ui.stats.companies },
    { value: String(projects.length), label: ui.stats.projects },
    { value: String(certifications.length), label: ui.stats.certifications },
  ];

  const hasVideos = projects.some((project) => project.videos.length > 0);

  const sections = Object.fromEntries(
    sectionKeys.map((key, i) => {
      const s = c.sections[key];
      const vars = {
        count:
          key === "experience"
            ? countWord(experience.length, locale)
            : key === "projects"
              ? countWord(projects.length, locale)
              : key === "english"
                ? englishCertifications.length
                : galleryCertifications.length,
        videos: hasVideos ? ui.projectsVideosSuffix : "",
        since: (key === "english" ? englishYearRange : certYearRange).split(" — ")[0] || careerStartYear,
      };
      return [
        key,
        {
          key,
          id: key,
          index: String(i + 1).padStart(2, "0"),
          href: homePath(locale, key),
          nav: s.nav,
          eyebrow: s.eyebrow,
          title: s.title,
          description: s.description ? t(s.description, vars) : undefined,
        },
      ];
    }),
  ) as Record<SectionKey, SectionInfo>;

  const socialLinks = (
    [
      ["linkedin", "LinkedIn"],
      ["github", "GitHub"],
      ["youtube", "YouTube"],
      ["telegram", "Telegram"],
    ] as const
  )
    .filter(([key]) => person.links[key])
    .map(([key, label]) => ({ key, label, href: person.links[key] as string }));

  if (!plain(raw.site.url)) warnings.add("site.url (set NEXT_PUBLIC_SITE_URL or deploy on Vercel)", false);
  const pdfFileName = raw.site.pdf.fileName[locale];

  return {
    locale,
    meta: c.meta,
    ui,
    person,
    eras,
    experience,
    projects,
    skills,
    education,
    certifications,
    featuredCertifications,
    galleryCertifications,
    galleryFeatured,
    englishCertifications,
    certCategories: (["Development", "Data", "Other"] as CertCategory[]).filter((cat) =>
      galleryCertifications.some((cert) => cert.category === cat),
    ),
    certYearRange,
    englishYearRange,
    careerStartYear,
    yearsOfExperience,
    currentJob,
    languagesLine,
    stats,
    hasVideos,
    sections,
    sectionOrder: [...sectionKeys] as SectionKey[],
    headerNav: raw.site.headerNav,
    socialLinks,
    issuers: raw.issuers,
    pdf: { fileName: pdfFileName, href: `/${pdfFileName}`, pageSize: raw.site.pdf.pageSize },
    siteUrlSetting: plain(raw.site.url),
    warnings: warnings.list,
  };
}

export interface SectionInfo {
  key: SectionKey;
  id: string;
  index: string;
  href: string;
  nav: string;
  eyebrow: string;
  title: string;
  description?: string;
}

export type Content = ReturnType<typeof build>;

const cache = new Map<Locale, Content>();
export function getContent(locale: Locale): Content {
  let content = cache.get(locale);
  if (!content) {
    content = build(locale);
    cache.set(locale, content);
  }
  return content;
}

export function getProject(locale: Locale, slug: string) {
  const { projects } = getContent(locale);
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;
  const n = projects.length;
  return { project: projects[index], index, previous: projects[(index - 1 + n) % n], next: projects[(index + 1) % n] };
}

/** Warnings for every language, de-duplicated (shared fields appear once). */
export function allContentWarnings(): string[] {
  return [...new Set(locales.flatMap((locale) => getContent(locale).warnings))];
}

/** The site URL setting from resume.ts (undefined while it is still TODO). */
export const siteUrlSetting = plain(raw.site.url);


// ───────────────────────── what client components receive ─────────────────────────

/** Serializable subset passed to SiteProvider for client components. */
export function getSiteClient(locale: Locale) {
  const c = getContent(locale);
  return {
    locale,
    ui: c.ui,
    nav: c.sectionOrder.map((key) => c.sections[key]),
    headerNav: c.headerNav,
    person: { name: c.person.name, shortName: c.person.shortName, initials: c.person.initials, photo: c.person.photo, photoFocus: c.person.photoFocus },
    socialLinks: c.socialLinks,
    pdf: { href: c.pdf.href, fileName: c.pdf.fileName },
    issuers: c.issuers,
  };
}
export type SiteClient = ReturnType<typeof getSiteClient>;
