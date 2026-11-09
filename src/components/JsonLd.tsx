import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { homePath } from "@/i18n/routes";
import { getSiteUrl } from "@/lib/site-url";

/** schema.org Person with sameAs links, rendered as JSON-LD on the home page (in the page's language). */
export function JsonLd({ locale }: { locale: Locale }) {
  const { person, skills, education } = getContent(locale);
  const origin = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.title,
    description: person.summary,
    url: `${origin}${homePath(locale) === "/" ? "" : homePath(locale)}`,
    email: `mailto:${person.email}`,
    image: person.photo ? `${origin}${person.photo}` : undefined,
    address: { "@type": "PostalAddress", addressLocality: "Caracas", addressCountry: "VE" },
    sameAs: Object.values(person.links).filter(Boolean),
    knowsLanguage: person.languages.map((l) => l.name),
    knowsAbout: skills.flatMap((g) => g.items).slice(0, 30),
    alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here except for "<", which is escaped.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
