import Image from "next/image";
import { Briefcase, CodeXml, Languages, Mail, MapPin } from "lucide-react";
import { getContent, t } from "@/content";
import type { Locale } from "@/i18n/config";
import { DownloadCv } from "./DownloadCv";
import { SectionLink } from "./SectionLink";
import { SocialLinks } from "./SocialLinks";
import { badge, button } from "./ui";

/** Pencil "Hero": name, title, tagline, facts, CTAs and photo with the "currently at" card. */
export function Hero({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  const { person, ui, currentJob } = c;
  const location = [person.location, person.workMode].filter(Boolean).join(" · ");
  return (
    <section aria-labelledby="hero-name" className="wrap pb-[var(--space-hero-bottom)] pt-[var(--space-hero-top)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10 lg:gap-20">
        {person.photo && (
          <div className="relative size-28 shrink-0 md:order-2 md:h-[312px] md:w-[260px] lg:h-[432px] lg:w-[360px] wide:h-[480px] wide:w-[400px]">
            <Image
              src={person.photo}
              alt={t(ui.portraitAlt, { name: person.name })}
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1440px) 400px, (min-width: 1024px) 360px, (min-width: 768px) 260px, 112px"
              style={{ objectPosition: person.photoFocus }}
              className="rounded-[28px] object-cover lg:rounded-[32px]"
            />
            {currentJob?.company && (
              <div className="absolute -left-7 bottom-5 hidden items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-card ring-1 ring-inset ring-line md:flex">
                <span className="flex size-9 items-center justify-center rounded-[10px] bg-accent-soft text-accent-strong">
                  <CodeXml size={18} aria-hidden="true" />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="whitespace-nowrap text-sm font-semibold text-fg">
                    {ui.currentlyAt} {currentJob.company}
                  </span>
                  {currentJob.stack.length > 0 && (
                    <span className="whitespace-nowrap font-mono text-xs text-fg-3">{currentJob.stack.slice(0, 3).join(" · ")}</span>
                  )}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          {person.availability && (
            <p className="flex h-8 w-fit items-center gap-2 rounded-full bg-surface px-3 text-[13px] font-medium text-fg-2 ring-1 ring-inset ring-line">
              <span aria-hidden="true" className="size-2 rounded-full bg-accent shadow-[0_0_6px_#3ddcb4aa]" />
              {person.availability}
            </p>
          )}

          <div className="flex flex-col gap-2 md:gap-3">
            <h1 id="hero-name" className="font-heading text-display leading-none font-semibold tracking-[-0.036em] text-fg">
              {person.name}
            </h1>
            <p className="font-heading text-hero-title leading-[1.3] font-medium text-fg">{person.title}</p>
          </div>

          <p className="max-w-[540px] text-lede leading-[1.55] text-fg-2 text-pretty">{person.tagline}</p>

          <p className="flex items-start gap-2 text-base text-fg-2 lg:text-[15px]">
            <MapPin size={16} aria-hidden="true" className="mt-[3px] shrink-0 lg:mt-0.5" />
            {location}
          </p>

          <ul className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap">
            <li className={badge}>
              <Briefcase size={16} aria-hidden="true" />
              {t(ui.yearsOfExperience, { n: c.yearsOfExperience })}
            </li>
            {c.languagesLine && (
              <li className={badge}>
                <Languages size={16} aria-hidden="true" />
                {c.languagesLine}
              </li>
            )}
          </ul>

          <div className="flex flex-col gap-4 pt-2 lg:flex-row lg:items-center lg:gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <DownloadCv pdf={c.pdf} ui={ui} className="w-full sm:w-auto" />
              <SectionLink section={c.sections.contact.id} href={c.sections.contact.href} className={`${button.secondary} w-full sm:w-auto`}>
                <Mail size={18} aria-hidden="true" />
                {ui.contact}
              </SectionLink>
            </div>
            <SocialLinks links={c.socialLinks} className="lg:border-l lg:border-line lg:pl-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
