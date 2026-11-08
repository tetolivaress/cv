import { GraduationCap } from "lucide-react";
import { education, person, sections, ui } from "@/content";
import { CertShowcase } from "./CertShowcase";
import { SectionHead } from "./SectionHead";
import { eyebrow } from "./ui";

const smallEyebrow = eyebrow.replace("text-[13px]", "text-xs");

/** Pencil "Education": degree card, languages card, featured certificates and the gallery modal. */
export function Education() {
  const s = sections.certifications;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="wrap section-y">
      <SectionHead
        id={`${s.id}-title`}
        index={s.index}
        label={s.eyebrow}
        title={s.title}
        description={s.description}
        className="max-w-[720px]"
      />

      <div className="mt-8 flex flex-col gap-6 md:mt-12 lg:flex-row lg:items-start">
        {education.map((item) => (
          <article
            key={item.degree}
            className="flex flex-1 flex-col gap-4 rounded-[20px] bg-surface p-6 ring-1 ring-inset ring-line md:flex-row md:items-center md:gap-6 md:p-8"
          >
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-accent-soft text-accent-strong">
              <GraduationCap size={26} aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <p className={smallEyebrow}>
                {ui.degree} · {item.year}
              </p>
              <h3 className="font-heading text-[26px] font-semibold tracking-[-0.5px] text-fg">{item.degree}</h3>
              <p className="text-base leading-6 text-fg-2">{item.school}</p>
            </div>
          </article>
        ))}

        {person.languages.length > 0 && (
          <article className="flex flex-col gap-3.5 rounded-[20px] bg-surface p-6 ring-1 ring-inset ring-line md:p-8 lg:w-[400px] lg:shrink-0">
            <h3 className={smallEyebrow}>{ui.languages}</h3>
            <ul className="flex flex-col gap-3.5">
              {person.languages.map((lang) => (
                <li key={lang.name} className="flex items-center justify-between gap-4">
                  <span className="flex flex-col gap-0.5">
                    <span className="font-heading text-xl font-semibold tracking-[-0.5px] text-fg">{lang.name}</span>
                    <span className="text-base text-fg-2 lg:text-[15px]">{lang.level}</span>
                  </span>
                  {lang.cefr && (
                    <span className="rounded-full bg-accent-soft px-3 py-1.5 font-mono text-[13px] font-semibold text-accent-strong">
                      {lang.cefr}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>

      <div className="mt-8 md:mt-12">
        <CertShowcase />
      </div>
    </section>
  );
}
