"use client";

import type { MouseEventHandler } from "react";
import { homePath, TOP } from "@/i18n/routes";
import { SectionLink } from "./SectionLink";
import { useSite } from "./site/SiteProvider";

interface Props {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  onScrollInPlace?: () => void;
}

/** Pencil "Logo": monogram + name (short name below 1280px). Goes to the top of the home page. */
export function Logo({ onClick, onScrollInPlace }: Props) {
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
        <span className="xl:hidden">{person.shortName}</span>
        <span className="hidden xl:inline">{person.name}</span>
      </span>
    </SectionLink>
  );
}
