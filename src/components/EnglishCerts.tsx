"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { Certification } from "@/content/types";
import { CertCard } from "./CertCard";
import { certLightboxItems, certLightboxLabels } from "./certLightbox";
import { useSite } from "./site/SiteProvider";

// The lightbox (Radix) is only downloaded when a certificate is first enlarged.
const Lightbox = dynamic(() => import("./Lightbox").then((m) => m.Lightbox), { ssr: false });

/** Every English certificate, newest first: swipe row on phones, grid from 768px. Each one enlarges in the lightbox. */
export function EnglishCerts({ certifications }: { certifications: Certification[] }) {
  const { ui } = useSite();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const slides = useMemo(() => certLightboxItems(certifications, ui), [certifications, ui]);

  return (
    <>
      <ul className="scrollbar-none -mx-[var(--gutter)] flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-4 overflow-x-auto px-[var(--gutter)] pb-1 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4">
        {certifications.map((cert, i) => (
          <li key={cert.key} className="w-[264px] shrink-0 snap-start md:w-auto">
            <CertCard cert={cert} onEnlarge={() => setLightbox(i)} />
          </li>
        ))}
      </ul>
      {lightbox !== null && (
        <Lightbox items={slides} index={lightbox} onIndexChange={setLightbox} labels={certLightboxLabels(ui)} />
      )}
    </>
  );
}
