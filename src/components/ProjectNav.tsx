import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ui, type Project } from "@/content";
import { cn } from "@/lib/cn";
import { cardLift } from "./ui";

function NavCard({ project, direction }: { project: Project; direction: "previous" | "next" }) {
  const next = direction === "next";
  const Arrow = next ? ArrowRight : ArrowLeft;
  return (
    <Link
      href={`/projects/${project.slug}`}
      // No viewport prefetch: keeps the critical path of project pages lean (static pages load fast on click anyway).
      prefetch={false}
      rel={next ? "next" : "prev"}
      className={cn(
        "flex flex-1 items-center gap-4 rounded-[20px] bg-surface p-4 ring-1 ring-inset ring-line",
        next && "flex-row-reverse text-right",
        cardLift,
      )}
    >
      {project.cover && (
        <span className="relative h-[60px] w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2 md:h-[72px] md:w-24">
          <Image src={project.cover} alt="" fill sizes="96px" className="object-cover" />
        </span>
      )}
      <span className={cn("flex min-w-0 flex-col gap-1", next && "items-end")}>
        <span className="flex items-center gap-1.5 font-mono text-xs uppercase text-fg-3">
          {!next && <Arrow size={14} aria-hidden="true" />}
          {next ? ui.project.next : ui.project.previous}
          {next && <Arrow size={14} aria-hidden="true" />}
        </span>
        <span className="truncate font-heading text-xl font-semibold tracking-[-0.5px] text-fg md:text-2xl">{project.name}</span>
      </span>
    </Link>
  );
}

/** Pencil "ProjectNav": previous / next project (wraps around). */
export function ProjectNav({ previous, next }: { previous: Project; next: Project }) {
  return (
    <nav aria-label="More projects" className="wrap pb-[var(--space-section)] pt-[calc(var(--space-section)/2)]">
      <div className="flex flex-col gap-4 sm:flex-row">
        <NavCard project={previous} direction="previous" />
        <NavCard project={next} direction="next" />
      </div>
    </nav>
  );
}
