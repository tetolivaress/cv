"use client";

import { useEffect } from "react";
import { scrollToSection, sectionIdFromPath, TOP, type PageKind } from "@/lib/section-nav";

/**
 * Makes clean section URLs work: on load it scrolls to the section named in the
 * path (e.g. /experience), and Back/Forward between sections scroll as well.
 */
export function SectionRouter({ page, initial }: { page: PageKind; initial?: string }) {
  useEffect(() => {
    if (initial && initial !== TOP) {
      // After Next.js has applied its own scroll for the new page.
      requestAnimationFrame(() => scrollToSection(initial, { smooth: false, focus: false }));
    }
  }, [initial]);

  useEffect(() => {
    // Run after the browser's own scroll restoration for the history entry, which would otherwise cut our scroll short.
    const onPopState = () =>
      requestAnimationFrame(() => scrollToSection(sectionIdFromPath(window.location.pathname), { focus: false }));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [page]);

  return null;
}
