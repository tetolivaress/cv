import { HomePage } from "@/components/HomePage";
import { sections } from "@/content";
import { sectionMetadata } from "@/lib/section-metadata";

export const metadata = sectionMetadata("projects");

/** Clean URL for the projects section of the home page. */
export default function ProjectsSectionPage() {
  return <HomePage section={sections.projects.id} />;
}
