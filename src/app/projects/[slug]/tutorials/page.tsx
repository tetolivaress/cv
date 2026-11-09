import type { Metadata } from "next";
import { ProjectPage } from "@/components/ProjectPage";
import { getProject, projects } from "@/content";

export const dynamicParams = false;

/**
 * Clean URL for a project's tutorials (/projects/<slug>/tutorials). Generated for
 * every project because static export rejects an empty list; for a project without
 * videos it simply shows the project page (nothing links there in that case).
 */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]/tutorials">): Promise<Metadata> {
  const found = getProject((await params).slug);
  if (!found) return {};
  return { title: `${found.project.name} tutorials`, alternates: { canonical: `/projects/${found.project.slug}` } };
}

export default async function Page({ params }: PageProps<"/projects/[slug]/tutorials">) {
  return <ProjectPage slug={(await params).slug} section="tutorials" />;
}
