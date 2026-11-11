import { getPanels3d } from "@/content/panels3d";
import type { Locale } from "@/i18n/config";
import { homePath, type SectionKey } from "@/i18n/routes";
import { About } from "./About";
import { Education } from "./Education";
import { English } from "./English";
import { Evolution } from "./Evolution";
import { Experience } from "./Experience";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { HomeView } from "./HomeView";
import { JsonLd } from "./JsonLd";
import { PageShell } from "./PageShell";
import { Projects } from "./Projects";
import { SideNav } from "./SideNav";
import { Skills } from "./Skills";

/** The one-page CV. Rendered at "/" ("/es") and at every clean section URL (/experience, /es/experiencia…). */
export function HomePage({ locale, section }: { locale: Locale; section?: SectionKey }) {
  return (
    <PageShell locale={locale} page="home" path={homePath(locale, section)} initialSection={section}>
      {/* Plain view: these in order, then the contact footer. 3D view (header switch): every one of them, hero and contact included, is a card of a ring turned by scrolling. */}
      <HomeView
        panels={getPanels3d(locale)}
        hero={<Hero locale={locale} />}
        plain={
          <>
            <Evolution locale={locale} />
            <About locale={locale} />
            <Experience locale={locale} />
            <Projects locale={locale} />
            <Skills locale={locale} />
            <Education locale={locale} />
            <English locale={locale} />
          </>
        }
        sections={{
          hero: <Hero locale={locale} embedded />,
          evolution: <Evolution locale={locale} />,
          about: <About locale={locale} />,
          experience: <Experience locale={locale} />,
          projects: <Projects locale={locale} />,
          skills: <Skills locale={locale} />,
          certifications: <Education locale={locale} />,
          english: <English locale={locale} />,
          contact: <Footer locale={locale} embedded />,
        }}
      />
      <SideNav />
      <JsonLd locale={locale} />
    </PageShell>
  );
}
