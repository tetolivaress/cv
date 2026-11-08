import { Globe } from "lucide-react";
import { formatDuration, formatYears, ui, type Experience } from "@/content";
import { cn } from "@/lib/cn";
import { remoteBadge, tag } from "./ui";

function RemoteBadge() {
  return (
    <span className={remoteBadge}>
      <Globe size={13} aria-hidden="true" />
      {ui.remote}
    </span>
  );
}

/**
 * Pencil "TimelineItem": date column (≥768px) + rail dot + card. On phones the
 * dates move inside the card. The current role gets a filled, glowing dot.
 */
export function TimelineItem({ job }: { job: Experience }) {
  const dates = formatYears(job.start, job.end);
  const duration = formatDuration(job.start, job.end);
  const isCurrent = job.end === ui.present || /present/i.test(job.end ?? "");
  const title = job.company ?? job.role;

  return (
    <li className="flex">
      <div className="hidden w-[168px] shrink-0 flex-col items-start gap-2 pr-4 pt-7 md:flex">
        {dates && <p className="font-mono text-sm font-medium text-fg">{dates}</p>}
        {duration && <p className="text-[13px] text-fg-3">{duration}</p>}
        {job.remote && <RemoteBadge />}
      </div>

      <div className="relative min-w-0 flex-1 pb-5 pl-5 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-line md:pb-6 md:pl-7">
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-[-5px] top-[27px] size-3 rounded-full border-[2.5px] md:top-8",
            isCurrent ? "border-accent bg-accent shadow-[0_0_10px_#3ddcb4aa]" : "border-accent-strong bg-bg",
          )}
        />
        <article className="relative flex flex-col gap-3.5 rounded-2xl bg-surface p-5 ring-1 ring-inset ring-line md:p-6">
          {(dates || job.remote) && (
            <div className="flex flex-wrap items-center gap-2.5 md:hidden">
              {dates && (
                <p className="font-mono text-[13px] font-medium text-fg-2">
                  {[dates, duration].filter(Boolean).join(" · ")}
                </p>
              )}
              {job.remote && <RemoteBadge />}
            </div>
          )}
          <header className="flex flex-col gap-0.5">
            <h3 className="font-heading text-xl font-semibold tracking-[-0.5px] text-fg md:text-[22px]">{title}</h3>
            {job.company && <p className="text-base font-medium text-fg-2">{job.role}</p>}
          </header>
          {job.highlights.length > 0 && (
            <ul className="flex flex-col gap-2">
              {job.highlights.map((item) => (
                <li key={item} className="flex gap-2.5 text-base leading-6 text-fg-2">
                  <span aria-hidden="true" className="mt-[11px] h-0.5 w-2 shrink-0 bg-accent-strong" />
                  <span className="min-w-0 flex-1">{item}</span>
                </li>
              ))}
            </ul>
          )}
          {job.stack.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Stack">
              {job.stack.map((item) => (
                <li key={item} className={tag}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </li>
  );
}
