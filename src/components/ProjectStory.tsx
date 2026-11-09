import { ArrowRight } from "lucide-react";
import type { ProjectStory as Story } from "@/content";
import type { UiCopy } from "@/content/copy";
import { cn } from "@/lib/cn";
import { SectionHead } from "./SectionHead";

/** Pencil "Story": Problem → Solution → Result case study. Only steps that have copy are shown. */
export function ProjectStory({ story, ui }: { story: Story; ui: UiCopy }) {
  const p = ui.project;
  const steps = (
    [
      ["problem", p.problem],
      ["solution", p.solution],
      ["result", p.result],
    ] as const
  ).filter(([key]) => story[key]);
  if (!steps.length) return null;

  return (
    <section aria-labelledby="story-title" className="border-y border-line bg-surface">
      <div className="wrap section-y">
        <SectionHead id="story-title" label={p.storyEyebrow} title={p.storyTitle} className="max-w-[720px]" />
        <ol className="mt-7 flex flex-col gap-4 md:mt-10 lg:flex-row lg:items-stretch">
          {steps.map(([key, label], i) => {
            const step = story[key]!;
            const isResult = key === "result";
            return (
              <li key={key} className="flex flex-col gap-4 lg:flex-1 lg:flex-row">
                {i > 0 && (
                  <span aria-hidden="true" className="hidden w-6 shrink-0 items-center justify-center text-fg-3 lg:flex">
                    <ArrowRight size={20} />
                  </span>
                )}
                <div
                  className={cn(
                    "flex flex-1 flex-col gap-3 rounded-[20px] p-7 ring-1 ring-inset",
                    isResult ? "bg-accent-soft ring-accent" : "bg-bg ring-line",
                  )}
                >
                  <p className="font-mono text-xs uppercase text-accent-strong">
                    {String(i + 1).padStart(2, "0")} — {label}
                  </p>
                  <h3 className="font-heading text-2xl font-semibold tracking-[-0.5px] text-fg">{step.title}</h3>
                  <p className="text-base leading-[26px] text-fg-2">{step.text}</p>
                  {"metrics" in step && step.metrics && (
                    <dl className="flex gap-6 pt-2">
                      {step.metrics.map((m) => (
                        <div key={m.label} className="flex flex-col-reverse gap-0.5">
                          <dt className="text-sm text-fg-2">{m.label}</dt>
                          <dd className="font-heading text-[28px] font-semibold tracking-[-0.5px] text-fg">{m.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
