/** How the home page is shown: the plain one-page CV, or the scroll-rotated 3D carousel. */
export type ViewMode = "plain" | "3d";

export const VIEW_STORAGE_KEY = "view";
const EVENT = "viewchange";
/** Fired when the set of section elements on the page changes (the 3D track mounted or unmounted). */
export const SECTIONS_EVENT = "sectionschange";

/**
 * Runs inline in <head>: a saved "3d" choice is put on <html data-view> before
 * first paint, so globals.css can hide the plain sections until the 3D track
 * mounts. First-time visitors and crawlers get the plain site.
 */
export const viewInitScript = `(function(){try{if(localStorage.getItem(${JSON.stringify(VIEW_STORAGE_KEY)})==="3d")document.documentElement.dataset.view="3d";}catch(e){}})();`;

export function getViewMode(): ViewMode {
  if (typeof document === "undefined") return "plain";
  return document.documentElement.dataset.view === "3d" ? "3d" : "plain";
}

/** `remember: false` is for automatic fallbacks (no WebGL): the saved choice stays as it was. */
export function setViewMode(mode: ViewMode, { remember = true } = {}) {
  if (remember) {
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch {
      // Storage can be blocked (private mode); the view still applies for this visit.
    }
  }
  if (mode === "3d") document.documentElement.dataset.view = "3d";
  else delete document.documentElement.dataset.view;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeViewMode(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

let pendingSection: string | null = null;
/** Section to show once the other view has mounted (the 3D track loads on demand, so it cannot be scrolled to right away). */
export function setPendingSection(id: string | null) {
  pendingSection = id;
}
export function takePendingSection(): string | null {
  const id = pendingSection;
  pendingSection = null;
  return id;
}
