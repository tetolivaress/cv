import { notFound } from "next/navigation";
import { getContent, getProject } from "@/content";
import type { Locale } from "@/i18n/config";
import { projectPath, TUTORIALS_ID } from "@/i18n/routes";
import { PageShell } from "./PageShell";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectHero } from "./ProjectHero";
import { ProjectNav } from "./ProjectNav";
import { ProjectStory } from "./ProjectStory";
import { ProjectTutorials } from "./ProjectTutorials";

/** A project's detail page. `tutorials` scrolls to the videos on load (/projects/x/tutorials). */
export function ProjectPage({ locale, slug, tutorials = false }: { locale: Locale; slug: string; tutorials?: boolean }) {
  const found = getProject(locale, slug);
  if (!found) notFound();
  const { project, index, previous, next } = found;
  const { ui, projects } = getContent(locale);

  return (
    <PageShell
      locale={locale}
      page="project"
      path={projectPath(locale, slug, tutorials)}
      initialSection={tutorials ? TUTORIALS_ID : undefined}
    >
      <ProjectHero project={project} index={index} locale={locale} />
      {project.videos.length > 0 && <ProjectTutorials project={project} />}
      {project.images.length > 0 && <ProjectGallery project={project} />}
      {project.story && <ProjectStory story={project.story} ui={ui} />}
      {projects.length > 1 && <ProjectNav previous={previous} next={next} locale={locale} ui={ui} />}
    </PageShell>
  );
}
