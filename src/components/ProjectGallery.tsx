"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { Project } from "@/content/types";
import type { LightboxItem } from "./Lightbox";
import { SectionHead } from "./SectionHead";
import { useSite } from "./site/SiteProvider";

const Lightbox = dynamic(() => import("./Lightbox").then((m) => m.Lightbox), { ssr: false });

/** Pencil "Gallery": screenshots (swipe carousel on phones, 3-column grid from 768px) with a lightbox. */
export function ProjectGallery({ project }: { project: Project }) {
  const { ui } = useSite();
  const [index, setIndex] = useState<number | null>(null);
  const p = ui.project;
  const slides = useMemo<LightboxItem[]>(
    () =>
      project.images.map((img) => ({
        key: img.src,
        title: img.alt,
        meta: project.name,
        content: (
          <Image
            src={img.src}
            alt={img.alt}
            width={1600}
            height={1000}
            sizes="(min-width: 768px) 760px, 100vw"
            className="mx-auto h-auto max-h-[65dvh] w-auto rounded-lg object-contain"
          />
        ),
      })),
    [project],
  );

  return (
    <section aria-labelledby="gallery-title" className="wrap pb-[var(--space-section)]">
      <div className="flex items-end justify-between gap-4">
        <SectionHead id="gallery-title" label={p.galleryEyebrow} title={p.galleryTitle} className="max-w-[560px]" />
        <p className="hidden text-sm text-fg-3 md:block">{p.galleryHint}</p>
      </div>
      <ul className="scrollbar-none -mx-[var(--gutter)] mt-7 flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-3 overflow-x-auto px-[var(--gutter)] md:mx-0 md:mt-10 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
        {project.images.map((img, i) => (
          <li key={img.src} className="w-[280px] shrink-0 snap-start md:w-auto">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="relative block aspect-[7/5] w-full cursor-zoom-in overflow-hidden rounded-[14px] bg-surface-2 ring-1 ring-inset ring-line md:aspect-[384/253] md:rounded-2xl"
            >
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 33vw, 280px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
      {index !== null && (
        <Lightbox
        items={slides}
        index={index}
        onIndexChange={setIndex}
        labels={{ dialog: p.galleryTitle, close: ui.certs.closeLightbox, previous: p.previous, next: p.next }}
        />
      )}
    </section>
  );
}
