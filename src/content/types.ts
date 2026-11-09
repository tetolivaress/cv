/**
 * Content types. `resume.ts` is written with the "Raw" shapes, where any text
 * can be a plain value (same in every language) or `{ en, es }`. `index.ts`
 * resolves one language, drops empty/TODO values and returns the clean shapes
 * that components and the PDF use.
 */
import type { Locale } from "../i18n/config";

export type { Locale };

/** A value per language. */
export type Localized<T> = Record<Locale, T>;
/** Plain value (identical in all languages) or one value per language. */
export type L<T> = T | Localized<T>;

/** "2021", "2021-05" or "Present". */
export type DateValue = string;

export interface Links {
  linkedin?: string;
  github?: string;
  telegram?: string;
  youtube?: string;
}

export type CertCategory = "English" | "Development" | "Data" | "Other";

export interface IssuerStyle {
  color: string;
  initial: string;
}

// ───────────────────────── raw (authoring) shapes ─────────────────────────

export interface RawLanguage {
  name: L<string>;
  level: L<string>;
  /** CEFR code shown in the pill, e.g. "B2". */
  cefr?: string;
  /** Mother tongue: shown as "Spanish native" instead of the CEFR code. */
  native?: boolean;
  note?: L<string>;
}

export interface RawPerson {
  name: string;
  shortName: string;
  initials: string;
  title: L<string>;
  tagline: L<string>;
  location: L<string>;
  /** Shown after the location, e.g. "Remote (GMT-4)". */
  workMode?: L<string>;
  /** Status pill above the name. Leave empty to hide it. */
  availability?: L<string>;
  email: string;
  /** Path under /public. */
  photo?: string;
  /** CSS object-position for the photo when it is cropped (e.g. the square phone crop). */
  photoFocus?: string;
  links: Links;
  languages: RawLanguage[];
  summary: L<string>;
}

export interface RawEra {
  id: string;
  label: L<string>;
  from: string;
  /** Year, or "Now". */
  to: string;
}

export interface RawExperience {
  company?: string;
  role: L<string>;
  start?: DateValue;
  end?: DateValue;
  remote?: boolean;
  era: string;
  highlights: L<string[]>;
  stack: string[];
}

export interface RawVideo {
  title: L<string>;
  youtubeId: string;
  duration?: string;
}

export interface RawProjectImage {
  src: string;
  alt: L<string>;
}

export interface RawStoryStep {
  title: L<string>;
  text: L<string>;
}

export interface RawProject {
  slug: string;
  name: string;
  url: string;
  summary: L<string>;
  description?: L<string>;
  role?: L<string>;
  dates?: L<string>;
  platform?: L<string>;
  stack: string[];
  cover?: string;
  videos: RawVideo[];
  images: RawProjectImage[];
  story?: {
    problem?: RawStoryStep;
    solution?: RawStoryStep;
    result?: RawStoryStep & { metrics?: { value: string; label: L<string> }[] };
  };
}

export interface RawSkillGroup {
  group: L<string>;
  items: L<string>[];
}

export interface RawEducation {
  degree: L<string>;
  school: string;
  year: string;
}

export interface RawCertification {
  category: CertCategory;
  name: L<string>;
  issuer: string;
  date?: DateValue;
  credentialUrl?: string;
  image?: string;
  featured?: boolean;
}

// ───────────────────────── clean shapes (one language) ─────────────────────────

export interface Language {
  name: string;
  level: string;
  cefr?: string;
  native?: boolean;
  note?: string;
}

export interface Person {
  name: string;
  shortName: string;
  initials: string;
  title: string;
  tagline: string;
  location: string;
  workMode?: string;
  availability?: string;
  email: string;
  photo?: string;
  photoFocus?: string;
  links: Links;
  languages: Language[];
  summary: string;
}

export interface Era {
  id: string;
  label: string;
  from: string;
  to: string;
}

export interface Experience {
  company?: string;
  role: string;
  start?: DateValue;
  end?: DateValue;
  remote?: boolean;
  era: string;
  highlights: string[];
  stack: string[];
}

export interface Video {
  title: string;
  youtubeId: string;
  duration?: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectStory {
  problem?: { title: string; text: string };
  solution?: { title: string; text: string };
  result?: { title: string; text: string; metrics?: { value: string; label: string }[] };
}

export interface Project {
  slug: string;
  name: string;
  url: string;
  summary: string;
  description?: string;
  role?: string;
  dates?: string;
  platform?: string;
  stack: string[];
  cover?: string;
  videos: Video[];
  images: ProjectImage[];
  story?: ProjectStory;
}

export interface SkillGroupData {
  group: string;
  items: string[];
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}

export interface Certification {
  /** Stable key (category + position), used for React keys. */
  key: string;
  category: CertCategory;
  name: string;
  issuer: string;
  date?: DateValue;
  credentialUrl?: string;
  image?: string;
  featured?: boolean;
}
