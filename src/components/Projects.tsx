import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { person, projects, sections, ui } from "@/content";
import { SocialIcon } from "./Icons";
import { ProjectCard } from "./ProjectCard";
import { SectionHead } from "./SectionHead";
import { button } from "./ui";

/** How many columns the GitHub tile spans to fill the last row at `cols` columns. */
const tileSpan = (cols: number) => {
  const rest = projects.length % cols;
  return rest === 0 ? cols : cols - rest;
};

/** Pencil "Projects": grid of 1 / 2 (≥640) / 3 (≥1024) / 4 (≥1920) columns plus the GitHub tile. */
export function Projects() {
  const s = sections.projects;
  const github = person.links.github;
  const spans = { "--span-2": tileSpan(2), "--span-3": tileSpan(3), "--span-4": tileSpan(4) } as CSSProperties;
  const Github = SocialIcon.github;

  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="wrap wrap-wide section-y">
      <SectionHead
        id={`${s.id}-title`}
        index={s.index}
        label={s.eyebrow}
        title={s.title}
        description={s.description}
        className="max-w-[640px]"
      />
      <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-12 md:gap-6 lg:grid-cols-3 3xl:grid-cols-4">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <ProjectCard project={project} priority={i === 0} />
          </li>
        ))}
        {github && (
          <li
            style={spans}
            className="sm:col-span-(--span-2) lg:col-span-(--span-3) 3xl:col-span-(--span-4)"
          >
            <div className="flex h-full min-h-[220px] flex-col justify-between gap-4 rounded-[20px] bg-accent-soft p-7">
              <div className="flex flex-col gap-3">
                <Github size={32} aria-hidden="true" className="text-accent-strong" />
                <h3 className="font-heading text-2xl font-semibold tracking-[-0.5px] text-fg">{ui.githubTile.title}</h3>
                <p className="max-w-[44ch] text-base leading-6 text-fg-2">{ui.githubTile.text}</p>
              </div>
              <a href={github} target="_blank" rel="noopener noreferrer me" className={`${button.secondarySm} w-fit`}>
                <ArrowUpRight size={16} aria-hidden="true" />
                {ui.githubTile.cta}
              </a>
            </div>
          </li>
        )}
      </ul>
    </section>
  );
}
