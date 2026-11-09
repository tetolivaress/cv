"use client";

import { sectionOrder, sections } from "@/content";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/cn";
import { homeSectionPath } from "@/lib/section-nav";
import { SectionLink } from "./SectionLink";

const ids = sectionOrder.map((key) => sections[key].id);

/** Pencil "SideNav (sticky)": section index in the left margin, only on ≥1920px screens. */
export function SideNav() {
  const active = useActiveSection(ids);
  return (
    <nav
      aria-label="Section index"
      className={cn(
        "fixed left-10 top-1/2 z-30 hidden w-[200px] -translate-y-1/2 transition-opacity duration-200 3xl:block",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ul className="flex flex-col gap-0.5">
        {sectionOrder.map((key) => {
          const section = sections[key];
          const isActive = active === section.id;
          return (
            <li key={key}>
              <SectionLink
                section={section.id}
                href={homeSectionPath(section.id)}
                aria-current={isActive ? "location" : undefined}
                className="group flex h-9 items-center gap-3"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 transition-all duration-200",
                    isActive ? "w-8 bg-accent" : "w-4 bg-line-strong group-hover:w-6",
                  )}
                />
                <span className={cn("font-mono text-xs", isActive ? "text-fg" : "text-fg-3 group-hover:text-fg")}>
                  {section.index} {section.nav}
                </span>
              </SectionLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
