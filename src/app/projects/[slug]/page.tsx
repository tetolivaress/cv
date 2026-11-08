import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ProjectHero } from "@/components/ProjectHero";
import { ProjectNav } from "@/components/ProjectNav";
import { ProjectStory } from "@/components/ProjectStory";
import { ProjectTutorials } from "@/components/ProjectTutorials";
import { getProject, person, projects } from "@/content";
import { ogImage } from "@/lib/og";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const found = getProject(slug);
  if (!found) return {};
  const { project } = found;
  const title = `${project.name} — project by ${person.name}`;
  return {
    title: project.name,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/projects/${project.slug}`,
      title,
      description: project.summary,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description: project.summary, images: [ogImage.url] },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const found = getProject(slug);
  if (!found) notFound();
  const { project, index, previous, next } = found;

  return (
    <>
      <PageShell onHome={false}>
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
