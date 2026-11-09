"use client";

import { sectionOrder, sections, site } from "@/content";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/cn";
import { homeSectionPath, type PageKind } from "@/lib/section-nav";
import { DownloadCv } from "./DownloadCv";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SectionLink } from "./SectionLink";
import { ThemeToggle } from "./ThemeToggle";

const sectionIds = sectionOrder.map((key) => sections[key].id);
const none: string[] = [];

/**
 * Pencil "Header" (≥1024px: logo, section nav, theme switch, CV) and
 * "HeaderMobile" (<1024px: logo, CV, hamburger). Sticky, with the active
 * section highlighted. Links use clean URLs (/experience, …) without "#".
 */
export function Header({ page }: { page: PageKind }) {
  const active = useActiveSection(page === "home" ? sectionIds : none);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg pt-[env(safe-area-inset-top)]">
      <div className="wrap flex h-16 items-center justify-between gap-4 lg:h-[75px]">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {site.headerNav.map((key) => {
              const section = sections[key];
              const isActive = active === section.id;
              return (
                <li key={key}>
                  <SectionLink
                    section={section.id}
                    href={homeSectionPath(section.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "flex h-11 items-center rounded-[10px] px-3.5 text-[15px] font-medium transition-colors duration-150",
                      isActive ? "bg-surface-2 text-fg" : "text-fg-2 hover:text-fg",
                    )}
                  >
                    {section.nav}
                  </SectionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <DownloadCv />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <DownloadCv variant="compact" />
          <MobileMenu active={active} />
        </div>
      </div>
    </header>
  );
}
