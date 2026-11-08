import { education, person, skills } from "@/content";
import { getSiteUrl } from "@/lib/site-url";

/** schema.org Person with sameAs links, rendered as JSON-LD on the home page. */
export function JsonLd() {
  const url = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.title,
    description: person.summary,
    url,
    email: `mailto:${person.email}`,
    image: person.photo ? `${url}${person.photo}` : undefined,
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
