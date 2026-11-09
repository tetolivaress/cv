"use client";

import { ui } from "@/content";

/** Keyboard skip link that moves focus to the main content without adding "#main" to the URL. */
export function SkipLink() {
  return (
    <a
      href="#main"
      onClick={(event) => {
        const main = document.getElementById("main");
        if (!main) return;
        event.preventDefault();
        main.focus();
      }}
      className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-xl bg-inverse px-4 py-3 text-sm font-semibold text-on-inverse transition-transform focus:translate-y-0"
    >
      {ui.skipToContent}
    </a>
  );
}
