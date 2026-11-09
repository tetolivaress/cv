/**
 * Pure formatting helpers (no content imports), safe to use in client components.
 */
import type { Locale } from "../i18n/config";
import type { IssuerStyle } from "./types";

/** Replaces `{key}` placeholders. A "singular|plural" string picks by `n`. */
export function t(template: string, vars: Record<string, string | number> = {}): string {
  let text = template;
  if (text.includes("|") && typeof vars.n === "number") {
    const [one, many] = text.split("|");
    text = vars.n === 1 ? one : many;
  }
  return text.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}

const WORDS: Record<Locale, string[]> = {
  en: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"],
  es: ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte"],
};

/** 9 → "Nine" / "Nueve" (capitalized), 42 → "42". */
export function countWord(n: number, locale: Locale): string {
  const word = WORDS[locale][n];
  return word ? word[0].toUpperCase() + word.slice(1) : String(n);
}

// ───────── dates ─────────

const MONTHS: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
};
const UNITS: Record<Locale, { yr: [string, string]; mo: [string, string] }> = {
  en: { yr: ["yr", "yrs"], mo: ["mo", "mos"] },
  es: { yr: ["año", "años"], mo: ["mes", "meses"] },
};
const PRESENT = /^present$/i;

export interface ParsedDate {
  year: number;
  month?: number;
  present?: boolean;
}

export const isPresent = (value?: string) => !!value && PRESENT.test(value);

export function parseDate(value?: string): ParsedDate | undefined {
  if (!value) return undefined;
  if (isPresent(value)) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1, present: true };
  }
  const match = value.match(/^(\d{4})(?:-(\d{1,2}))?/);
  if (!match) return undefined;
  return { year: Number(match[1]), month: match[2] ? Number(match[2]) : undefined };
}

/** Years only, as in the design: "2024 — Present", "2021", "2018 — 2021". */
export function formatYears(start: string | undefined, end: string | undefined, presentLabel: string): string {
  const s = parseDate(start);
  const e = parseDate(end);
  const endLabel = e?.present ? presentLabel : e ? String(e.year) : undefined;
  if (s && endLabel) return String(s.year) === endLabel ? endLabel : `${s.year} — ${endLabel}`;
  return String(s?.year ?? endLabel ?? "");
}

/** Month precision when known, for the PDF: "May 2021 – Sep 2021" / "may 2021 – sep 2021". */
export function formatMonths(start: string | undefined, end: string | undefined, presentLabel: string, locale: Locale): string {
  const fmt = (d?: ParsedDate) =>
    !d ? undefined : d.present ? presentLabel : d.month ? `${MONTHS[locale][d.month - 1]} ${d.year}` : String(d.year);
  const s = fmt(parseDate(start));
  const e = fmt(parseDate(end));
  if (s && e) return s === e ? s : `${s} – ${e}`;
  return s ?? e ?? "";
}

/** "2 yrs 7 mos" / "2 años 7 meses". Undefined when the dates are too vague. */
export function formatDuration(start: string | undefined, end: string | undefined, locale: Locale): string | undefined {
  const s = parseDate(start);
  const e = parseDate(end);
  if (!s || !e) return undefined;
  let months: number;
  if (s.month && e.month) months = (e.year - s.year) * 12 + (e.month - s.month) + 1;
  else if (e.year > s.year) months = (e.year - s.year) * 12;
  else return undefined;
  if (months <= 0) return undefined;
  const u = UNITS[locale];
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} ${u.yr[years === 1 ? 0 : 1]}`);
  if (rest) parts.push(`${rest} ${u.mo[rest === 1 ? 0 : 1]}`);
  return parts.join(" ");
}

export const sortKey = (value?: string) => {
  const d = parseDate(value);
  return d ? d.year * 100 + (d.month ?? 0) : -1;
};

/** Badge color/initial for a certificate issuer (grey with its first letter when not configured). */
export function issuerStyle(issuers: Record<string, IssuerStyle>, issuer: string): IssuerStyle {
  return issuers[issuer] ?? { color: "#6F7D78", initial: issuer.trim()[0]?.toUpperCase() ?? "·" };
}
