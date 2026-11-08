/**
 * Clean, typed view of `resume.ts`. Every component and the PDF script import
 * from here, never from `resume.ts` directly. Values that are empty or still
 * "TODO" are dropped, and `contentWarnings` lists them for the build log.
 */
import * as raw from "./resume";
import type {
  CertCategory,
  Certification,
  Experience,
  IssuerStyle,
  Language,
  Links,
  Person,
  Project,
  Video,
} from "./types";

export type * from "./types";

// ───────────────────────── helpers ─────────────────────────

const TODO = /^\s*TODO\b/i;

export function isMissing(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "" || TODO.test(value);
  return false;
}

const warnings: string[] = [];

function take<T>(value: T | undefined, where: string, warn = true): T | undefined {
  if (isMissing(value)) {
    if (warn) warnings.push(where);
    return undefined;
  }
  return value;
}

function list(values: string[] | undefined, where: string): string[] {
  const kept = (values ?? []).filter((v) => !isMissing(v));
  if ((values ?? []).length !== kept.length) warnings.push(where);
  return kept;
}

/** Replaces `{key}` placeholders. A "singular|plural" string picks by `n`. */
export function t(template: string, vars: Record<string, string | number> = {}): string {
  let text = template;
  if (text.includes("|") && typeof vars.n === "number") {
    const [one, many] = text.split("|");
    text = vars.n === 1 ? one : many;
  }
  return text.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}

const WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];
/** 9 → "Nine" (capitalized), 42 → "42". */
export function countWord(n: number): string {
  const word = WORDS[n];
  return word ? word[0].toUpperCase() + word.slice(1) : String(n);
}

// ───────────────────────── dates ─────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PRESENT = /^present$/i;

interface ParsedDate {
  year: number;
  month?: number; // 1-12
  present?: boolean;
}

export function parseDate(value?: string): ParsedDate | undefined {
  if (!value) return undefined;
  if (PRESENT.test(value)) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1, present: true };
  }
  const match = value.match(/^(\d{4})(?:-(\d{1,2}))?/);
  if (!match) return undefined;
  return { year: Number(match[1]), month: match[2] ? Number(match[2]) : undefined };
}

/** Years only, as in the design: "2024 — Present", "2021", "2018 — 2021". */
export function formatYears(start?: string, end?: string): string {
  const s = parseDate(start);
  const e = parseDate(end);
  const present = raw.site.ui.present;
  const endLabel = e?.present ? present : e ? String(e.year) : undefined;
  if (s && endLabel) return String(s.year) === endLabel ? endLabel : `${s.year} — ${endLabel}`;
  return String(s?.year ?? endLabel ?? "");
}

/** Month precision when known, for the PDF: "May 2021 – Sep 2021". */
export function formatMonths(start?: string, end?: string): string {
  const fmt = (d?: ParsedDate) =>
    !d ? undefined : d.present ? raw.site.ui.present : d.month ? `${MONTHS[d.month - 1]} ${d.year}` : String(d.year);
  const s = fmt(parseDate(start));
  const e = fmt(parseDate(end));
  if (s && e) return s === e ? s : `${s} – ${e}`;
  return s ?? e ?? "";
}

/** "2 yrs 7 mos", "5 mos", "1 yr". Undefined when the dates are too vague. */
export function formatDuration(start?: string, end?: string): string | undefined {
  const s = parseDate(start);
  const e = parseDate(end);
  if (!s || !e) return undefined;
  let months: number;
  if (s.month && e.month) months = (e.year - s.year) * 12 + (e.month - s.month) + 1;
  else if (e.year > s.year) months = (e.year - s.year) * 12;
  else return undefined;
  if (months <= 0) return undefined;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  if (rest) parts.push(`${rest} ${rest === 1 ? "mo" : "mos"}`);
  return parts.join(" ");
}

const sortKey = (value?: string) => {
  const d = parseDate(value);
  return d ? d.year * 100 + (d.month ?? 0) : -1;
};

// ───────────────────────── clean data ─────────────────────────

function cleanLinks(links: Links): Links {
  const out: Links = {};
  for (const key of Object.keys(links) as (keyof Links)[]) {
    const value = take(links[key], `person.links.${key}`);
    if (value) out[key] = value;
  }
  return out;
}

const p = raw.person;
export const person: Person = {
  ...p,
  workMode: take(p.workMode, "person.workMode", false),
  availability: take(p.availability, "person.availability", false),
  photo: take(p.photo, "person.photo"),
  links: cleanLinks(p.links),
  languages: p.languages
    .filter((l) => !isMissing(l.name))
    .map<Language>((l) => ({ ...l, cefr: take(l.cefr, `language ${l.name}.cefr`, false) })),
};

export const eras = raw.eras;

export const experience: Experience[] = raw.experience.map((job, i) => {
  const label = `experience[${i}] ${isMissing(job.company) ? job.role : job.company}`;
  return {
    ...job,
    company: take(job.company, `${label}: company`),
    start: take(job.start, `${label}: start date`),
    end: take(job.end, `${label}: end date`),
    highlights: list(job.highlights, `${label}: highlights`),
    stack: list(job.stack, `${label}: stack`),
  };
});

export const projects: Project[] = raw.projects.map((project, i) => {
  const label = `projects[${i}] ${project.name}`;
  const videos: Video[] = [];
  project.videos.forEach((video, v) => {
    const id = take(video.youtubeId, `${label}: videos[${v}].youtubeId`);
    if (!id) return;
    videos.push({ ...video, youtubeId: id, title: take(video.title, `${label}: videos[${v}].title`) ?? project.name });
  });
  return {
    ...project,
    summary: take(project.summary, `${label}: summary`) ?? "",
    role: take(project.role, `${label}: role`),
    dates: take(project.dates, `${label}: dates`, false),
    platform: take(project.platform, `${label}: platform`, false),
    cover: take(project.cover, `${label}: cover`),
    stack: list(project.stack, `${label}: stack`),
    videos,
    images: project.images.filter((img) => !isMissing(img.src)),
  };
});

export function getProject(slug: string) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return undefined;
  const n = projects.length;
  return {
    project: projects[index],
    index,
    previous: projects[(index - 1 + n) % n],
    next: projects[(index + 1) % n],
  };
}

export const skills = Object.entries(raw.skills)
  .map(([group, items]) => ({ group, items: list(items, `skills.${group}`) }))
  .filter((g) => g.items.length > 0);

export const education = raw.education.filter((e) => !isMissing(e.degree));

export const certifications: Certification[] = raw.certifications
  .map((cert, i) => {
    const missing: string[] = [];
    const pick = (key: "date" | "credentialUrl" | "image") => {
      if (isMissing(cert[key])) {
        missing.push(key);
        return undefined;
      }
      return cert[key];
    };
    const cleaned = { ...cert, date: pick("date"), credentialUrl: pick("credentialUrl"), image: pick("image") };
    if (missing.length) warnings.push(`certifications[${i}] ${cert.issuer} — ${cert.name}: ${missing.join(", ")}`);
    return cleaned;
  })
  // Newest first; undated ones keep their order at the end.
  .map((cert, order) => ({ cert, order }))
  .sort((a, b) => sortKey(b.cert.date) - sortKey(a.cert.date) || a.order - b.order)
  .map(({ cert }) => cert);

export const certCategories: CertCategory[] = ["English", "Development", "Data", "Other"];

export const featuredCertifications = (() => {
  const featured = certifications.filter((c) => c.featured);
  return featured.length ? featured : certifications.slice(0, 4);
})();

export function issuerStyle(issuer: string): IssuerStyle {
  return raw.issuers[issuer] ?? { ...raw.defaultIssuer, initial: issuer.trim()[0]?.toUpperCase() ?? "·" };
}

export function certYearRange(): string {
  const years = certifications.map((c) => parseDate(c.date)?.year).filter((y): y is number => !!y);
  if (!years.length) return "";
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min} — ${max}`;
}

// ───────────────────────── derived facts ─────────────────────────

const startYears = experience.map((job) => parseDate(job.start)?.year).filter((y): y is number => !!y);
export const careerStartYear = Math.min(...startYears);
export const yearsOfExperience = new Date().getFullYear() - careerStartYear;

export const currentJob = experience.find((job) => job.end && PRESENT.test(job.end));

/** "Spanish native · English B2" */
export const languagesLine = person.languages
  .map((l) => (l.cefr && !/native/i.test(l.level) ? `${l.name} ${l.cefr}` : `${l.name} ${l.level.toLowerCase()}`))
  .join(" · ");

export const stats = [
  { value: `${yearsOfExperience}+`, label: raw.site.ui.stats.years },
  { value: String(experience.length), label: raw.site.ui.stats.companies },
  { value: String(projects.length), label: raw.site.ui.stats.projects },
  { value: String(certifications.length), label: raw.site.ui.stats.certifications },
];

export const hasVideos = projects.some((p) => p.videos.length > 0);

/** Section copy with counts filled in. */
const s = raw.site.sections;
export const sections = {
  ...s,
  experience: { ...s.experience, description: t(s.experience.description, { count: countWord(experience.length) }) },
  projects: {
    ...s.projects,
    description: t(s.projects.description, {
      count: countWord(projects.length),
      videos: hasVideos ? raw.site.ui.projectsVideosSuffix : "",
    }),
  },
  certifications: {
    ...s.certifications,
    description: t(s.certifications.description, {
      count: certifications.length,
      since: certYearRange().split(" — ")[0] || careerStartYear,
    }),
  },
};
export type SectionKey = keyof typeof sections;
export const sectionOrder: SectionKey[] = ["about", "experience", "projects", "skills", "certifications", "contact"];

export const site = { ...raw.site, url: take(raw.site.url, "site.url (set NEXT_PUBLIC_SITE_URL or deploy on Vercel)") };
export const ui = raw.site.ui;

/** Everything that was skipped because it is empty or still TODO. */
export const contentWarnings: readonly string[] = warnings;

export const socialLinks = (
  [
    ["linkedin", "LinkedIn"],
    ["github", "GitHub"],
    ["youtube", "YouTube"],
    ["telegram", "Telegram"],
  ] as const
)
  .filter(([key]) => person.links[key])
  .map(([key, label]) => ({ key, label, href: person.links[key] as string }));

export const pdfPath = `/${raw.site.pdf.fileName}`;
