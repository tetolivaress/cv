import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { DownloadCv } from "./DownloadCv";
import { SectionHead } from "./SectionHead";
import { Timeline } from "./Timeline";

/** Pencil "Experience": sticky head (≥1024px) next to the era timeline. */
export function Experience({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  const s = c.sections.experience;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="wrap section-y">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex flex-col items-start gap-7 lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:w-[300px] lg:shrink-0">
          <SectionHead id={`${s.id}-title`} index={s.index} label={s.eyebrow} title={s.title} description={s.description} />
          <div className="hidden lg:block">
            <DownloadCv pdf={c.pdf} ui={c.ui} variant="outline" />
          </div>
        </div>
        <Timeline locale={locale} />
      </div>
    </section>
  );
}
