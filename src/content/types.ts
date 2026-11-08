/**
 * Content types. `src/content/resume.ts` holds the raw data (it may still
 * contain "TODO" placeholders); `src/content/index.ts` cleans it and is what
 * the website and the PDF import.
 */

/** "2021", "2021-05" or "Present". */
export type DateValue = string;

export interface Links {
  linkedin?: string;
  github?: string;
  telegram?: string;
  youtube?: string;
}

export interface Language {
  name: string;
  /** Human label, e.g. "Native" or "Upper intermediate". */
  level: string;
  /** CEFR code shown in the pill, e.g. "B2". */
  cefr?: string;
  /** Extra note for the PDF, e.g. "certified". */
  note?: string;
}

export interface Person {
  name: string;
  /** Short name used in the compact mobile header. */
  shortName: string;
  initials: string;
  title: string;
  tagline: string;
  location: string;
  /** Shown after the location, e.g. "Remote (GMT-4)". */
  workMode?: string;
  /** Status pill above the name. Leave empty to hide it. */
  availability?: string;
  email: string;
  /** Path under /public. */
  photo?: string;
  /** CSS object-position for the photo when it is cropped (e.g. the square phone crop). */
  photoFocus?: string;
  links: Links;
  languages: Language[];
  summary: string;
}

export interface Era {
  id: string;
  /** Stack headline, e.g. "React & React Native". */
  label: string;
  from: string;
  /** Year or "Now". */
  to: string;
}

export interface Experience {
  company?: string;
  role: string;
  start?: DateValue;
  end?: DateValue;
  remote?: boolean;
  /** Which era of the timeline this role belongs to (Era.id). */
  era: string;
  highlights: string[];
  stack: string[];
}

export interface Video {
  title: string;
  youtubeId: string;
  /** Optional "mm:ss" label for the playlist. */
  duration?: string;
}

export interface ProjectImage {
  /** Path under /public, e.g. "/projects/caribito/checkout.png". */
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
  /** Longer copy for the detail page hero. Falls back to `summary`. */
  description?: string;
  role?: string;
  /** Free text, e.g. "2024" or "Mar 2024 — Present". */
  dates?: string;
  platform?: string;
  stack: string[];
  /** Card and hero image, path under /public. */
  cover?: string;
  videos: Video[];
  images: ProjectImage[];
  story?: ProjectStory;
}

export type CertCategory = "English" | "Development" | "Data" | "Other";

export interface Certification {
  category: CertCategory;
  name: string;
  issuer: string;
  date?: DateValue;
  credentialUrl?: string;
  /** Path under /public/certificates. */
  image?: string;
  /** Shown on the home page and in the PDF. */
  featured?: boolean;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}

export interface IssuerStyle {
  color: string;
  initial: string;
}

export interface SectionCopy {
  id: string;
  /** Number shown in eyebrows and navigation, e.g. "02". */
  index: string;
  nav: string;
  eyebrow: string;
  title: string;
  description?: string;
}
