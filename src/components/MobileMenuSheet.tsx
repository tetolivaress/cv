"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import { useRef } from "react";
import { sectionOrder, sections, ui } from "@/content";
import { cn } from "@/lib/cn";
import { homeSectionPath, pushPath, scrollToSection, TOP } from "@/lib/section-nav";
import { DownloadCv } from "./DownloadCv";
import { Logo } from "./Logo";
import { SectionLink } from "./SectionLink";
import { SocialLinks } from "./SocialLinks";
import { ThemeToggle } from "./ThemeToggle";
import { button } from "./ui";

export interface MobileMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Where focus goes when the sheet closes (the hamburger button). */
  returnFocus: () => void;
  active: string | null;
}

/**
 * Pencil "Home · menu open": full-screen sheet with numbered links, theme, CV
 * and socials. Loaded on demand by MobileMenu, so Radix is not in the initial bundle.
 */
export default function MobileMenuSheet({ open, onOpenChange, returnFocus, active }: MobileMenuSheetProps) {
  // Section picked on the home page: scroll to it once the sheet has closed and unlocked scrolling.
  const pending = useRef<string | null>(null);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Radix locks page scroll through the overlay, so the sheet needs one. */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg lg:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const target = pending.current;
            pending.current = null;
            if (target && scrollToSection(target)) pushPath(homeSectionPath(target));
            else returnFocus();
          }}
          className="fixed inset-0 z-50 flex h-dvh flex-col bg-bg animate-fade-in pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] lg:hidden"
        >
          <Dialog.Title className="sr-only">{ui.menuTitle}</Dialog.Title>
          <div className="border-b border-line">
            <div className="wrap flex h-16 items-center justify-between">
              <Logo
                onClick={() => onOpenChange(false)}
                onScrollInPlace={() => {
                  pending.current = TOP;
                }}
              />
              <div className="flex items-center gap-2">
                <DownloadCv variant="compact" />
                <Dialog.Close className={button.icon} aria-label={ui.menuClose}>
                  <X size={22} aria-hidden="true" />
                </Dialog.Close>
              </div>
            </div>
          </div>

          <nav aria-label="Sections" className="wrap flex min-h-0 flex-1 flex-col overflow-y-auto pt-4">
            <ul className="flex flex-col">
              {sectionOrder.map((key) => {
                const section = sections[key];
                const isActive = active === section.id;
                return (
                  <li key={key} className="border-b border-line">
                    <SectionLink
                      section={section.id}
                      href={homeSectionPath(section.id)}
                      onClick={() => onOpenChange(false)}
                      onScrollInPlace={() => {
                        pending.current = section.id;
                      }}
                      aria-current={isActive ? "location" : undefined}
                      className="flex min-h-[59px] items-center justify-between gap-4 py-2"
                    >
                      <span className="flex items-center gap-3.5">
                        <span className={cn("font-mono text-xs", isActive ? "text-accent-strong" : "text-fg-3")}>
                          {section.index}
                        </span>
                        <span className="font-heading text-[26px] font-semibold tracking-[-0.5px] text-fg">
                          {section.nav}
                        </span>
                      </span>
                      <ArrowUpRight size={20} aria-hidden="true" className="text-fg-2" />
                    </SectionLink>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto flex flex-col gap-4 pb-4 pt-8">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-fg-2">{ui.theme}</span>
                <ThemeToggle />
              </div>
              <DownloadCv className="w-full" />
              <SocialLinks className="justify-center" />
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
