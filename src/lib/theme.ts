export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
const EVENT = "themechange";

/**
 * Runs inline in <head> before first paint so there is no flash of the wrong
 * theme. A saved choice wins; otherwise the system preference is used.
 */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var m=window.matchMedia("(prefers-color-scheme: dark)");var t=s==="light"||s==="dark"?s:(m.matches?"dark":"light");var d=document.documentElement;d.dataset.theme=t;d.style.colorScheme=t;}catch(e){}})();`;

export function getTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  window.dispatchEvent(new Event(EVENT));
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (private mode); the theme still applies for this visit.
  }
  apply(theme);
}

/** Subscribe to theme changes, including system changes when no choice is saved. */
export function subscribeTheme(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystem = () => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {}
    if (saved !== "light" && saved !== "dark") apply(media.matches ? "dark" : "light");
  };
  window.addEventListener(EVENT, callback);
  media.addEventListener("change", onSystem);
  return () => {
    window.removeEventListener(EVENT, callback);
    media.removeEventListener("change", onSystem);
  };
}
