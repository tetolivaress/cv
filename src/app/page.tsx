import { About } from "@/components/About";
import { Education } from "@/components/Education";
import { Evolution } from "@/components/Evolution";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { Projects } from "@/components/Projects";
import { SideNav } from "@/components/SideNav";
import { Skills } from "@/components/Skills";

export default function HomePage() {
  return (
    <>
      <PageShell>
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
