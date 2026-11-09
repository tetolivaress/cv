import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
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

export default async function Page({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  return <ProjectPage slug={slug} />;
}
