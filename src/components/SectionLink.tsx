"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { currentPage, pushPath, scrollToSection, type PageKind } from "@/lib/section-nav";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  /** Id of the target section ("top" for the top of the page). */
  section: string;
  /** Clean URL of that section, e.g. "/experience". */
  href: string;
  /** Which page the section lives on. Links only scroll in place on that page. */
  page?: PageKind;
  /** Runs instead of the default scroll, e.g. to close a menu first. */
  onScrollInPlace?: () => void;
};

/**
 * Link to a section by its clean URL. When the section is on the current page
 * it smooth-scrolls there and updates the address bar; otherwise (or with
 * Cmd/Ctrl-click, middle-click…) it behaves like a normal link to that URL.
 */
export function SectionLink({ section, href, page = "home", onScrollInPlace, onClick, ...rest }: Props) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (currentPage() !== page) return;
    if (onScrollInPlace) {
      event.preventDefault();
      onScrollInPlace();
      return;
    }
    if (scrollToSection(section)) {
      event.preventDefault();
      pushPath(href);
    }
  };
  return <Link href={href} prefetch={false} scroll={false} onClick={handleClick} {...rest} />;
}
