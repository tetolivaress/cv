import { notFound } from "next/navigation";
import { getProject, projects } from "@/content";
import { Footer } from "./Footer";
import { PageShell } from "./PageShell";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectHero } from "./ProjectHero";
import { ProjectNav } from "./ProjectNav";
import { ProjectStory } from "./ProjectStory";
import { ProjectTutorials } from "./ProjectTutorials";

/** A project's detail page. `section` scrolls to a part of it on load (e.g. /projects/x/tutorials). */
export function ProjectPage({ slug, section }: { slug: string; section?: string }) {
  const found = getProject(slug);
  if (!found) notFound();
  const { project, index, previous, next } = found;

  return (
    <>
      <PageShell page="project" initialSection={section}>
        <ProjectHero project={project} index={index} />
        {project.videos.length > 0 && <ProjectTutorials project={project} />}
        {project.images.length > 0 && <ProjectGallery project={project} />}
        {project.story && <ProjectStory story={project.story} />}
        {projects.length > 1 && <ProjectNav previous={previous} next={next} />}
      </PageShell>
      <Footer />
    </>
  );
}
