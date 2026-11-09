/**
 * Page/metadata/static-params builders shared by the English (app/(en)) and
 * Spanish (app/(es)/es) route trees, so each route file is a few lines.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/HomePage";
import { ProjectPage } from "@/components/ProjectPage";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import { sectionKeys, sectionSlugs, type SectionKey } from "@/i18n/routes";
import { homeMetadata, projectMetadata, sectionMetadata } from "./metadata";

type Params<T> = { params: Promise<T> };

export function homeRoute(locale: Locale) {
  return {
    metadata: homeMetadata(locale),
    Page: () => <HomePage locale={locale} />,
  };
}

/** /about, /experience… ("projects" has its own folder because it also holds the project pages). */
export function sectionRoute(locale: Locale) {
  const keys = sectionKeys.filter((key) => key !== "projects");
  const find = (slug: string) => keys.find((key) => sectionSlugs[locale][key] === slug);
  return {
    generateStaticParams: () => keys.map((key) => ({ section: sectionSlugs[locale][key] })),
    generateMetadata: async ({ params }: Params<{ section: string }>): Promise<Metadata> => {
      const key = find((await params).section);
      return key ? sectionMetadata(locale, key) : {};
    },
    Page: async ({ params }: Params<{ section: string }>) => {
      const key = find((await params).section);
      if (!key) notFound();
      return <HomePage locale={locale} section={key} />;
    },
  };
}

export function projectsSectionRoute(locale: Locale) {
  const key: SectionKey = "projects";
  return {
    metadata: sectionMetadata(locale, key),
    Page: () => <HomePage locale={locale} section={key} />,
  };
}

/**
 * /projects/<slug> and /projects/<slug>/tutorials. The tutorials URL is
 * generated for every project because static export rejects an empty list;
 * without videos it simply shows the project page (nothing links there).
 */
export function projectRoute(locale: Locale, tutorials = false) {
  return {
    generateStaticParams: () => getContent(locale).projects.map((project) => ({ slug: project.slug })),
    generateMetadata: async ({ params }: Params<{ slug: string }>): Promise<Metadata> =>
      projectMetadata(locale, (await params).slug, tutorials),
    Page: async ({ params }: Params<{ slug: string }>) => (
      <ProjectPage locale={locale} slug={(await params).slug} tutorials={tutorials} />
    ),
  };
}
