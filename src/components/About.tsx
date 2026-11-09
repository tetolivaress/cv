import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { SectionHead } from "./SectionHead";

/** Pencil "About": section head + summary, and a 2×2 grid of stats. */
export function About({ locale }: { locale: Locale }) {
  const { sections, person, stats } = getContent(locale);
  const s = sections.about;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="wrap section-y">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-24">
        <div className="flex flex-1 flex-col gap-6">
          <SectionHead id={`${s.id}-title`} index={s.index} label={s.eyebrow} title={s.title} />
          <p className="measure text-summary leading-[1.65] text-fg-2 text-pretty">{person.summary}</p>
        </div>
        <dl className="grid shrink-0 grid-cols-2 gap-x-4 gap-y-6 md:gap-x-8 md:gap-y-8 lg:w-[480px] lg:self-start">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-1.5 border-t border-line-strong pt-5">
              <dt className="text-base text-fg-2 lg:text-[15px]">{stat.label}</dt>
              <dd className="font-heading text-stat leading-none font-semibold tracking-[-2px] text-fg">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
