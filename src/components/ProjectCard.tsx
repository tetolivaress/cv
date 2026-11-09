import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { getContent, t, type Project } from "@/content";
import type { Locale } from "@/i18n/config";
import { projectPath } from "@/i18n/routes";
import { displayUrl } from "@/lib/site-url";
import { button, cardLift, tag } from "./ui";

/** Pencil "ProjectCard": cover with tutorial count, name, role, summary, stack and actions. */
export function ProjectCard({ project, locale, priority = false }: { project: Project; locale: Locale; priority?: boolean }) {
  const { ui } = getContent(locale);
  const detail = projectPath(locale, project.slug);
  const videos = project.videos.length;
  return (
    <article className={`flex h-full flex-col overflow-hidden rounded-[20px] bg-surface ring-1 ring-inset ring-line ${cardLift}`}>
      <Link href={detail} tabIndex={-1} aria-hidden="true" className="relative block aspect-[5/3] overflow-hidden bg-surface-2">
        {project.cover && (
          <Image
            src={project.cover}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1920px) 440px, (min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        {videos > 0 && (
          <span className="absolute left-3.5 top-3.5 flex h-7 items-center gap-1.5 rounded-full bg-[#0d1412cc] px-2.5 text-xs font-semibold text-white">
            <Play size={12} aria-hidden="true" />
            {t(ui.tutorialsChip, { n: videos })}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-[18px] md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <h3 className="font-heading text-[22px] font-semibold tracking-[-0.5px] text-fg">
              <Link href={detail} className="rounded-sm">
                {project.name}
              </Link>
            </h3>
            <p className="truncate font-mono text-xs text-fg-3">
              {[project.dates, project.role].filter(Boolean).join(" · ") || displayUrl(project.url)}
            </p>
          </div>
          <Link href={detail} className={`${button.ghost} pl-3`} aria-label={`${ui.projectDetails}: ${project.name}`}>
            {ui.projectDetails}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {project.summary && <p className="text-base leading-6 text-fg-2">{project.summary}</p>}

        {project.stack.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label={ui.stackLabel}>
            {project.stack.map((item) => (
              <li key={item} className={tag}>
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex gap-2 pt-1">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${button.primarySm} flex-1`}
            aria-label={`${ui.visitSite}: ${displayUrl(project.url)}`}
          >
            <ArrowUpRight size={16} aria-hidden="true" />
            {ui.visitSite}
          </a>
          {videos > 0 && (
            <Link href={projectPath(locale, project.slug, true)} className={`${button.secondarySm} flex-1`}>
              <Play size={16} aria-hidden="true" />
              {ui.watchTutorial}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
