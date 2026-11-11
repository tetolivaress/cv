"use client";

import type { MouseEventHandler } from "react";
import { homePath, TOP } from "@/i18n/routes";
import { cn } from "@/lib/cn";
import { SectionLink } from "./SectionLink";
import { useSite } from "./site/SiteProvider";

interface Props {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  onScrollInPlace?: () => void;
  /**
   * Home header, which also holds the view switch: monogram only from 1024px to 1279px.
   * "late" also waits until 1536px for the full name (Spanish, whose nav labels are longer).
   */
  tight?: boolean | "late";
}

/** Pencil "Logo": monogram + name (short name below 1280px). Goes to the top of the home page. */
export function Logo({ onClick, onScrollInPlace, tight }: Props) {
  const { person, locale } = useSite();
  return (
    <SectionLink
      section={TOP}
      href={homePath(locale)}
      onClick={onClick}
      onScrollInPlace={onScrollInPlace}
      className="flex h-11 items-center gap-2.5 rounded-lg"
    >
      {/* Dark monogram in light mode, accent monogram in dark mode: keeps AA contrast in both. */}
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-[10px] bg-[#0d1412] font-heading text-[15px] font-semibold text-accent dark:bg-accent dark:text-on-accent"
      >
        {person.initials}
      </span>
      <span className="whitespace-nowrap font-heading text-[17px] font-semibold tracking-[-0.2px] text-fg">
        <span className={cn(tight && "lg:max-xl:sr-only", tight === "late" ? "2xl:hidden" : "xl:hidden")}>{person.shortName}</span>
        <span className={tight === "late" ? "hidden 2xl:inline" : "hidden xl:inline"}>{person.name}</span>
      </span>
    </SectionLink>
  );
}
