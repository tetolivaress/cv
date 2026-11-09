"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";
import { t } from "@/content/format";
import type { Video } from "@/content/types";
import { useSite } from "./site/SiteProvider";

let warmed = false;
/** Opens connections to YouTube on hover/focus so the click starts playback faster. */
function warmConnections() {
  if (warmed) return;
  warmed = true;
  for (const href of ["https://www.youtube-nocookie.com", "https://www.google.com", "https://i.ytimg.com"]) {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    document.head.append(link);
  }
}

interface Props {
  video: Video;
  /** Small round image shown next to the title (the author photo). */
  avatar?: string;
  /** Start playing right away (used when picking a video from the playlist). */
  autoplay?: boolean;
}

/**
 * Lightweight YouTube embed: a 16:9 poster with a play button. The iframe
 * (youtube-nocookie) only loads after the visitor clicks.
 */
export function VideoEmbed({ video, avatar, autoplay = false }: Props) {
  const { ui } = useSite();
  const [playing, setPlaying] = useState(autoplay);
  const label = t(ui.project.play, { title: video.title });

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black md:rounded-[20px]">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.youtubeId)}?autoplay=1&rel=0&playsinline=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          onPointerEnter={warmConnections}
          onFocus={warmConnections}
          aria-label={label}
          className="group absolute inset-0 flex flex-col justify-between p-3 text-left md:p-5"
        >
          <Image
            src={`https://i.ytimg.com/vi/${encodeURIComponent(video.youtubeId)}/hqdefault.jpg`}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 1024px) 768px, 100vw"
            className="object-cover"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,#00000066_0%,#0000_35%,#0000_60%,#000000b3_100%)]" />
          <span className="relative flex items-center gap-2.5">
            {avatar && (
              <Image src={avatar} alt="" width={32} height={32} className="size-8 rounded-full object-cover object-top" />
            )}
            <span className="line-clamp-1 text-sm font-semibold text-white md:text-base">{video.title}</span>
          </span>
          <span className="relative flex justify-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-accent text-on-accent shadow-[0_8px_24px_#00000055] transition-transform duration-150 group-hover:scale-105 md:size-[76px]">
              <Play size={30} aria-hidden="true" className="ml-1 fill-current" />
            </span>
          </span>
          <span aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
