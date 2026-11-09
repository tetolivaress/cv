import type { Locale } from "@/i18n/config";
import { homePath, type SectionKey } from "@/i18n/routes";
import { About } from "./About";
import { Education } from "./Education";
import { English } from "./English";
import { Evolution } from "./Evolution";
import { Experience } from "./Experience";
import { Hero } from "./Hero";
import { JsonLd } from "./JsonLd";
import { PageShell } from "./PageShell";
import { Projects } from "./Projects";
import { SideNav } from "./SideNav";
import { Skills } from "./Skills";

/** The one-page CV. Rendered at "/" ("/es") and at every clean section URL (/experience, /es/experiencia…). */
export function HomePage({ locale, section }: { locale: Locale; section?: SectionKey }) {
  return (
    <PageShell locale={locale} page="home" path={homePath(locale, section)} initialSection={section}>
      <Hero locale={locale} />
      <Evolution locale={locale} />
      <About locale={locale} />
      <Experience locale={locale} />
      <Projects locale={locale} />
      <Skills locale={locale} />
      <Education locale={locale} />
      <English locale={locale} />
      <SideNav />
      <JsonLd locale={locale} />
    </PageShell>
  );
}
