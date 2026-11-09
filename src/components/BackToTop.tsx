"use client";

import type { ReactNode } from "react";
import { parsePath, projectPath, homePath } from "@/i18n/routes";
import { pushPath, scrollToSection, TOP } from "@/lib/section-nav";

/** Scrolls to the top and resets the address bar to the page's own URL (home or the project page). */
export function BackToTop({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a
      href="/"
      className={className}
      onClick={(event) => {
        event.preventDefault();
        const route = parsePath(window.location.pathname);
        const path = !route ? "/" : route.page === "project" ? projectPath(route.locale, route.slug) : homePath(route.locale);
        scrollToSection(TOP);
        pushPath(path);
      }}
    >
      {children}
    </a>
  );
}
