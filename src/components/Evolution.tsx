import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { ArrowGlyph } from "./ArrowGlyph";

/** Pencil "Evolution": the stack eras strip, oldest to newest. */
export function Evolution({ locale }: { locale: Locale }) {
  const { eras, ui } = getContent(locale);
  const ordered = [...eras].reverse();
  const current = eras[0];
  return (
    <section aria-label={ui.stackEvolution} className="wrap">
      <p className="mb-3.5 font-mono text-xs uppercase text-fg-3">
        {ui.stackEvolution} · {ordered[0]?.from}
        <ArrowGlyph label={ui.to} />
        {new Date().getFullYear()}
      </p>
      <ol className="flex flex-col border-y border-line md:flex-row">
        {ordered.map((era, i) => {
          const isNow = era.id === current.id;
          return (
            <li
              key={era.id}
              className={cn(
                "flex items-center justify-between gap-1.5 py-4 md:flex-1 md:flex-col md:items-start md:justify-start md:py-7 md:pr-5",
                i > 0 && "border-t border-line md:border-l md:border-t-0 md:pl-6",
              )}
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase text-accent-strong">
                  {era.from}
                  <ArrowGlyph label={ui.to} />
                  {isNow ? ui.now : era.to}
                </span>
                {isNow && (
                  <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-on-accent">
                    {ui.now}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "text-right font-heading text-[17px] font-semibold tracking-[-0.5px] md:text-left md:text-lg lg:text-[21px]",
                  isNow ? "text-fg" : "text-fg-2",
                )}
              >
                {era.label}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
