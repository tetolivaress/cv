"use client";

import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/cn";
import type { PageKind } from "@/lib/section-nav";
import { DownloadCv } from "./DownloadCv";
import { LanguageSwitch } from "./LanguageSwitch";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { SectionLink } from "./SectionLink";
import { useSite } from "./site/SiteProvider";
import { ThemeToggle } from "./ThemeToggle";

const none: string[] = [];

/**
 * Pencil "Header" (≥1024px: logo, section nav, language + theme switches, CV)
 * and "HeaderMobile" (<1024px: logo, CV, hamburger). Sticky, with the active
 * section highlighted. Links use clean URLs (/experience, /es/experiencia…).
 */
export function Header({ page }: { page: PageKind }) {
  const site = useSite();
  const ids = site.nav.map((s) => s.id);
  const active = useActiveSection(page === "home" ? ids : none);
  const headerNav = site.nav.filter((s) => site.headerNav.includes(s.key));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg pt-[env(safe-area-inset-top)]">
      <div className="wrap flex h-16 items-center justify-between gap-4 lg:h-[75px]">
        <Logo />

        <nav aria-label={site.ui.primaryNav} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {headerNav.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.key}>
                  <SectionLink
                    section={section.id}
                    href={section.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      // Six sections fit at 1024px (Spanish labels are the longest) with tighter padding until xl.
                      "flex h-11 items-center whitespace-nowrap rounded-[10px] px-1.5 text-[15px] font-medium transition-colors duration-150 xl:px-3.5",
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

        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
          <LanguageSwitch />
          <ThemeToggle />
          {/* Compact CV button until there is room for the full label. */}
          <span className="xl:hidden">
            <DownloadCv pdf={site.pdf} ui={site.ui} variant="compact" />
          </span>
          <span className="hidden xl:inline-flex">
            <DownloadCv pdf={site.pdf} ui={site.ui} />
          </span>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <DownloadCv pdf={site.pdf} ui={site.ui} variant="compact" />
          <MobileMenu active={active} />
        </div>
      </div>
    </header>
  );
}
