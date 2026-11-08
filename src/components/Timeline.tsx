import { eras, experience, ui } from "@/content";
import { ArrowGlyph } from "./ArrowGlyph";
import { TimelineItem } from "./TimelineItem";

/** Experience grouped by stack era (Pencil "EraMarker" + "TimelineItem"), newest first. */
export function Timeline() {
  return (
    <ol className="flex min-w-0 flex-1 flex-col">
      {eras.map((era) => {
        const jobs = experience.filter((job) => job.era === era.id);
        if (!jobs.length) return null;
        const isNow = era.id === eras[0].id;
        return (
          <li key={era.id}>
            <div className="flex">
              <div aria-hidden="true" className="hidden w-[168px] shrink-0 md:block" />
              <div className="relative flex-1 py-6 pl-6 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-line md:py-7 md:pl-8">
                <span
                  aria-hidden="true"
                  className="absolute left-[-8px] top-[37px] size-[18px] rounded-full border-[3px] border-accent bg-bg md:top-[43px]"
                />
                <p className="font-mono text-xs uppercase text-accent-strong">
                  {ui.eraPrefix} {era.id} · {era.from}
                  <ArrowGlyph />
                  {isNow ? ui.now : era.to}
                </p>
                <h3 className="mt-1 font-heading text-xl font-semibold tracking-[-0.5px] text-fg md:text-2xl">
                  {era.label}
                </h3>
              </div>
            </div>
            <ol>
              {jobs.map((job, i) => (
                <TimelineItem key={`${job.company ?? job.role}-${i}`} job={job} />
              ))}
            </ol>
          </li>
        );
      })}
    </ol>
  );
}
