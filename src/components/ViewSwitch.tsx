"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { scrollToSection } from "@/lib/section-nav";
import { getViewMode, setPendingSection, setViewMode, subscribeViewMode, takePendingSection, type ViewMode } from "@/lib/view-mode";
import { useSite } from "./site/SiteProvider";

/** The section crossing a line 40% down the viewport (same rule as useActiveSection), or null above the first one. */
function sectionInView(ids: readonly string[]): string | null {
  const line = window.innerHeight * 0.4;
  let current: string | null = null;
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= line) current = id;
  }
  return current;
}

/**
 * 2D | 3D switch, styled like the language switch. Home page only; saved in localStorage.
 * `variant="toggle"` is a single 3D on/off button for the header widths where the pair does not fit.
 */
export function ViewSwitch({ className, variant = "pair" }: { className?: string; variant?: "pair" | "toggle" }) {
  const { ui, nav } = useSite();
  // The server renders the plain site; the inline head script has already applied a saved choice to <html>.
  const view = useSyncExternalStore(subscribeViewMode, getViewMode, () => null);
  const options: { value: ViewMode; label: string; name: string }[] = [
    { value: "plain", label: "2D", name: ui.viewPlain },
    { value: "3d", label: "3D", name: ui.view3d },
  ];

  const choose = (mode: ViewMode) => {
    if (mode === getViewMode()) return;
    // Stay on the section the visitor was reading: both views use the same section ids.
    setPendingSection(sectionInView(nav.map((s) => s.id)));
    setViewMode(mode);
    // The plain sections are back in the page on the next frame; the 3D track loads on demand and takes the pending section itself.
    if (mode === "plain") {
      requestAnimationFrame(() => {
        const section = takePendingSection();
        if (section) scrollToSection(section, { smooth: false, focus: false });
      });
    }
  };

  if (variant === "toggle") {
    const on = view === "3d";
    return (
      <button
        type="button"
        aria-pressed={view === null ? undefined : on}
        title={ui.view3d}
        onClick={() => choose(on ? "plain" : "3d")}
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold ring-1 ring-inset ring-line transition-colors duration-200",
          on ? "bg-surface-2 text-fg" : "text-fg-3 hover:text-fg",
          className,
        )}
      >
        <span aria-hidden="true">3D</span>
        <span className="sr-only">{ui.view3d}</span>
      </button>
    );
  }

  return (
    <div role="group" aria-label={ui.view} className={cn("flex h-11 items-center gap-0.5 rounded-full p-1 ring-1 ring-inset ring-line", className)}>
      {options.map(({ value, label, name }) => {
        const active = view === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={view === null ? undefined : active}
            title={name}
            onClick={() => choose(value)}
            className={cn(
              "flex size-9 items-center justify-center rounded-full font-mono text-xs font-semibold transition-colors duration-200",
              active ? "bg-surface-2 text-fg" : "text-fg-3 hover:text-fg",
            )}
          >
            <span aria-hidden="true">{label}</span>
            <span className="sr-only">{name}</span>
          </button>
        );
      })}
    </div>
  );
}
