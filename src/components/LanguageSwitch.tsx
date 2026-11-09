"use client";

import { usePathname } from "next/navigation";
import { localeMeta, locales } from "@/i18n/config";
import { translatePath } from "@/i18n/routes";
import { cn } from "@/lib/cn";
import { rememberLanguage } from "@/lib/language-pref";
import { useSite } from "./site/SiteProvider";

/** EN | ES switch, styled like the theme toggle. Links to the same page in the other language. */
export function LanguageSwitch({ className }: { className?: string }) {
  const { locale, ui } = useSite();
  const pathname = usePathname();
  return (
    <nav aria-label={ui.language} className={cn("flex h-11 items-center gap-0.5 rounded-full p-1 ring-1 ring-inset ring-line", className)}>
      {locales.map((target) => {
        const active = target === locale;
        const meta = localeMeta[target];
        return (
          <a
            key={target}
            href={translatePath(pathname, target)}
            hrefLang={meta.htmlLang}
            lang={meta.htmlLang}
            aria-current={active ? "true" : undefined}
            title={meta.name}
            onClick={() => rememberLanguage(target)}
            className={cn(
              "flex size-9 items-center justify-center rounded-full font-mono text-xs font-semibold transition-colors duration-200",
              active ? "bg-surface-2 text-fg" : "text-fg-3 hover:text-fg",
            )}
          >
            {meta.label}
            <span className="sr-only"> {meta.name}</span>
          </a>
        );
      })}
    </nav>
  );
}
