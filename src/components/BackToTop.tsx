"use client";

import type { ReactNode } from "react";
import { currentPage, pushPath, scrollToSection, TOP } from "@/lib/section-nav";

/** Scrolls to the top and resets the address bar to the page's own URL (/ or /projects/<slug>). */
export function BackToTop({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a
      href="/"
      className={className}
      onClick={(event) => {
        event.preventDefault();
        const parts = window.location.pathname.split("/").filter(Boolean);
        const path = currentPage() === "project" ? `/${parts.slice(0, 2).join("/")}` : "/";
        scrollToSection(TOP);
        pushPath(path);
      }}
    >
      {children}
    </a>
  );
}
