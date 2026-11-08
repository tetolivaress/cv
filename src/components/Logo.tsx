import Link from "next/link";
import { person } from "@/content";

/** Pencil "Logo": monogram + name. The short name is used below 1280px. */
export function Logo() {
  return (
    <Link href="/" prefetch={false} className="flex h-11 items-center gap-2.5 rounded-lg">
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
    </Link>
  );
}
