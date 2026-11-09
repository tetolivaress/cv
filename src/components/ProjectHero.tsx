import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";
import { getContent, t, type Project } from "@/content";
import type { Locale } from "@/i18n/config";
import { projectPath, TUTORIALS_ID } from "@/i18n/routes";
import { displayUrl } from "@/lib/site-url";
import { SectionLink } from "./SectionLink";
import { button, tag } from "./ui";

/** Pencil "ProjectHero": breadcrumb, name, summary, CTAs, meta panel and cover. */
export function ProjectHero({ project, index, locale }: { project: Project; index: number; locale: Locale }) {
  const { ui, projects, sections } = getContent(locale);
  const p = ui.project;
  const meta = [
    project.role && { key: p.role, value: project.role },
    project.dates && { key: p.dates, value: project.dates },
    project.platform && { key: p.platform, value: project.platform },
  ].filter(Boolean) as { key: string; value: string }[];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section aria-labelledby="project-name" className="wrap flex flex-col gap-6 pb-10 pt-6 md:gap-8 md:pb-16 md:pt-10">
      <div className="flex items-center justify-between gap-3">
        <SectionLink
          section={sections.projects.id}
          href={sections.projects.href}
          className="flex h-11 items-center gap-1.5 text-base font-medium text-fg-2 hover:text-fg md:text-[15px]"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          {p.allProjects}
        </SectionLink>
        <p className="font-mono text-xs uppercase text-fg-3">{t(p.counter, { i: pad(index + 1), n: pad(projects.length) })}</p>
      </div>

      <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:gap-16">
        <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-5">
          <h1 id="project-name" className="font-heading text-display leading-none font-semibold tracking-[-0.036em] text-fg">
            {project.name}
          </h1>
          <p className="max-w-[600px] text-[17px] leading-[26px] text-fg-2 text-pretty md:text-xl md:leading-[30px]">
            {project.description ?? project.summary}
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <a href={project.url} target="_blank" rel="noopener noreferrer" className={`${button.primary} w-full sm:w-auto`}>
              <ArrowUpRight size={18} aria-hidden="true" />
              {ui.visitLiveSite}
              <span className="sr-only"> ({displayUrl(project.url)})</span>
            </a>
            {project.videos.length > 0 && (
              <SectionLink
                section={TUTORIALS_ID}
                href={projectPath(locale, project.slug, true)}
                page="project"
                className={`${button.secondary} w-full sm:w-auto`}
              >
                <Play size={18} aria-hidden="true" />
                {t(ui.watchTutorials, { n: project.videos.length })}
              </SectionLink>
            )}
          </div>
        </div>

        {(meta.length > 0 || project.stack.length > 0) && (
          <dl className="flex flex-col rounded-[20px] bg-surface px-6 py-2 ring-1 ring-inset ring-line lg:w-[420px] lg:shrink-0">
            {meta.map((row) => (
              <div key={row.key} className="flex flex-col gap-1 border-b border-line py-4 last:border-b-0 md:flex-row md:items-center md:justify-between md:gap-4">
                <dt className="font-mono text-xs uppercase text-fg-3">{row.key}</dt>
                <dd className="text-base font-medium text-fg md:text-right">{row.value}</dd>
              </div>
            ))}
            {project.stack.length > 0 && (
              <div className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between md:gap-4">
                <dt className="font-mono text-xs uppercase text-fg-3">{p.stack}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-1.5 md:justify-end">
                    {project.stack.map((item) => (
                      <li key={item} className={tag}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        )}
      </div>

      {project.cover && (
        <div className="relative aspect-[353/219] overflow-hidden rounded-2xl bg-surface-2 md:aspect-[2/1] md:rounded-3xl lg:aspect-[1200/552]">
          <Image
            src={project.cover}
            alt={t(p.coverAlt, { name: project.name })}
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1520px) 1280px, (min-width: 1440px) calc(100vw - 240px), (min-width: 1024px) calc(100vw - 96px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 40px)"
            className="object-cover"
          />
        </div>
      )}
    </section>
  );
}
