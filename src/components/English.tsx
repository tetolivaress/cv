import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { EnglishCerts } from "./EnglishCerts";
import { SectionHead } from "./SectionHead";

/** English certificates in their own section, apart from the certifications gallery. */
export function English({ locale }: { locale: Locale }) {
  const c = getContent(locale);
  const s = c.sections.english;
  if (!c.englishCertifications.length) return null;
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
      <div className="mt-8 md:mt-12">
        <EnglishCerts certifications={c.englishCertifications} />
      </div>
    </section>
  );
}
