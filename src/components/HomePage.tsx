import { About } from "./About";
import { Education } from "./Education";
import { Evolution } from "./Evolution";
import { Experience } from "./Experience";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { JsonLd } from "./JsonLd";
import { PageShell } from "./PageShell";
import { Projects } from "./Projects";
import { SideNav } from "./SideNav";
import { Skills } from "./Skills";

/** The one-page CV. Rendered at "/" and at every clean section URL (/experience, …). */
export function HomePage({ section }: { section?: string }) {
  return (
    <>
      <PageShell page="home" initialSection={section}>
        <Hero />
        <Evolution />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <SideNav />
      </PageShell>
      <Footer />
      <JsonLd />
    </>
  );
}
