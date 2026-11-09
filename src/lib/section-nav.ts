/**
 * Clean section URLs without "#": every home section has its own path
 * (/experience, /projects, …) that is also a real static page. On a page that
 * already contains the section we scroll to it and update the address bar with
 * history.pushState instead of reloading.
 */

export type PageKind = "home" | "project";

/** "top" means the top of the page. */
export const TOP = "top";

export const homeSectionPath = (id: string) => (id === TOP ? "/" : `/${id}`);

/** The page currently rendered (set as data-page on the page shell). */
export function currentPage(): PageKind | null {
  const value = document.querySelector<HTMLElement>("[data-page]")?.dataset.page;
  return value === "home" || value === "project" ? value : null;
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scrolls to a section on the current page. Returns false when the section is
 * not on this page, so the caller can fall back to a normal navigation.
 */
export function scrollToSection(id: string, { smooth = true, focus = true } = {}): boolean {
  const behavior: ScrollBehavior = smooth && !prefersReducedMotion() ? "smooth" : "auto";
  if (id === TOP) {
    window.scrollTo({ top: 0, behavior });
    if (focus) document.getElementById("main")?.focus({ preventScroll: true });
    return true;
  }
  const target = document.getElementById(id);
  if (!target) return false;
  target.scrollIntoView({ behavior, block: "start" });
  if (focus) {
    // Like a native anchor jump: the next Tab continues from the section.
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
  return true;
}

/** Adds a history entry for the new path (no reload; Next.js keeps its router in sync). */
export function pushPath(path: string) {
  if (window.location.pathname !== path) window.history.pushState(null, "", path);
}

/** Which section a path points to on the given page kind. */
export function sectionFromPath(pathname: string, page: PageKind): string {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (page === "home") return parts[0] ?? TOP;
  // /projects/<slug>/<section>
  return parts[2] ?? TOP;
}
