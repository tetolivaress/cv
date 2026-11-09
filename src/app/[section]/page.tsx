import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/HomePage";
import { sectionOrder, sections, type SectionKey } from "@/content";
import { sectionMetadata } from "@/lib/section-metadata";

// /projects has its own page because the /projects folder also holds the project pages.
const keys = sectionOrder.filter((key) => key !== "projects");
const findKey = (id: string) => keys.find((key) => sections[key].id === id);

export const dynamicParams = false;

export function generateStaticParams() {
  return keys.map((key) => ({ section: sections[key].id }));
}

export async function generateMetadata({ params }: PageProps<"/[section]">): Promise<Metadata> {
  const key = findKey((await params).section);
  return key ? sectionMetadata(key as SectionKey) : {};
}

/** Clean section URLs: /about, /experience, /skills, /certifications, /contact. */
export default async function SectionPage({ params }: PageProps<"/[section]">) {
  const key = findKey((await params).section);
  if (!key) notFound();
  return <HomePage section={sections[key].id} />;
}
