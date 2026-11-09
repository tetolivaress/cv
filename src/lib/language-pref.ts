import type { Locale } from "../i18n/config";

export const LANGUAGE_STORAGE_KEY = "lang";

/**
 * Inline script: if the visitor chose the other language with the switch
 * before, replace this page with its translation. Crawlers and first-time
 * visitors (nothing stored) stay on the URL they opened.
 */
export function languageRedirectScript(locale: Locale, alternatePath: string) {
  return `(function(){try{var p=localStorage.getItem(${JSON.stringify(LANGUAGE_STORAGE_KEY)});if(p&&p!==${JSON.stringify(locale)})location.replace(${JSON.stringify(alternatePath)}+location.search);}catch(e){}})();`;
}

export function rememberLanguage(locale: Locale) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  } catch {
    // Storage blocked: the switch still navigates, it just won't be remembered.
  }
}
