"use client";

import Image from "next/image";
import { useState } from "react";
import { t } from "@/content/format";
import type { Project } from "@/content/types";
import { TUTORIALS_ID } from "@/i18n/routes";
import { cn } from "@/lib/cn";
import { SectionHead } from "./SectionHead";
import { useSite } from "./site/SiteProvider";
import { VideoEmbed } from "./VideoEmbed";

function totalMinutes(durations: (string | undefined)[]) {
  let seconds = 0;
  for (const d of durations) {
    const parts = d?.split(":").map(Number);
    if (!parts || parts.some(Number.isNaN)) return undefined;
    seconds += parts.reduce((acc, n) => acc * 60 + n, 0);
  }
  return Math.round(seconds / 60);
}

/** Pencil "Tutorials": player (VideoPlayer) and playlist (VideoItem) for a project's YouTube videos. */
export function ProjectTutorials({ project }: { project: Project }) {
  const { ui, person } = useSite();
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const videos = project.videos;
  const video = videos[active];
  const minutes = totalMinutes(videos.map((v) => v.duration));
  const p = ui.project;

  return (
    <section id={TUTORIALS_ID} aria-labelledby="tutorials-title" className="wrap pb-[var(--space-section)] pt-10 md:pt-[72px]">
      <SectionHead
        id="tutorials-title"
        label={p.tutorialsEyebrow}
        title={p.tutorialsTitle}
        description={t(p.tutorialsDescription, { name: project.name })}
        className="max-w-[640px]"
      />
      <div className={cn("mt-7 flex flex-col gap-5 md:mt-10 lg:flex-row lg:gap-8", videos.length === 1 && "lg:block")}>
        <div className="min-w-0 lg:flex-1">
          <VideoEmbed key={video.youtubeId} video={video} avatar={person.photo} autoplay={autoplay} />
        </div>
        {videos.length > 1 && (
          <div className="flex flex-col gap-1 lg:w-[400px] lg:shrink-0">
            <div className="flex items-center justify-between px-2 pb-2">
              <h3 className="font-heading text-lg font-semibold tracking-[-0.5px] text-fg">{p.playlist}</h3>
              <p className="font-mono text-xs uppercase text-fg-3">
                {t(p.videosCount, { n: videos.length })}
                {minutes ? ` · ${minutes} min` : ""}
              </p>
            </div>
            <ol className="flex flex-col gap-1">
              {videos.map((item, i) => {
                const current = i === active;
                return (
                  <li key={item.youtubeId}>
                    <button
                      type="button"
                      aria-current={current ? "true" : undefined}
                      onClick={() => {
                        setActive(i);
                        setAutoplay(true);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors duration-150",
                        current ? "bg-accent-soft" : "hover:bg-surface-2",
                      )}
                    >
                      <span className="relative flex h-[68px] w-[120px] shrink-0 items-end justify-end overflow-hidden rounded-lg bg-surface-2 p-1.5 md:h-[72px] md:w-32">
                        <Image
                          src={`https://i.ytimg.com/vi/${encodeURIComponent(item.youtubeId)}/mqdefault.jpg`}
                          alt=""
                          fill
                          unoptimized
                          sizes="128px"
                          className="object-cover"
                        />
                        {item.duration && (
                          <span className="relative rounded bg-black/70 px-1.5 py-0.5 font-mono text-[11px] text-white">
                            {item.duration}
                          </span>
                        )}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-base leading-[22px] font-semibold text-fg md:text-[15px] md:leading-5">{item.title}</span>
                        <span className={cn("font-mono text-xs uppercase", current ? "text-accent-strong" : "text-fg-3")}>
                          {t(p.part, { n: i + 1 })}
                          {current ? ` · ${p.nowPlaying}` : ""}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
