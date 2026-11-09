export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { label: string; name: string; htmlLang: string; ogLocale: string }> = {
  en: { label: "EN", name: "English", htmlLang: "en", ogLocale: "en_US" },
  es: { label: "ES", name: "Español", htmlLang: "es", ogLocale: "es_ES" },
};

export const isLocale = (value: unknown): value is Locale => locales.includes(value as Locale);
