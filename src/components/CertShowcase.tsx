"use client";

import dynamic from "next/dynamic";
import { LayoutGrid } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { certCategories, certifications, featuredCertifications, t, ui, type CertCategory } from "@/content";
import { CertCard } from "./CertCard";
import { certLightboxItems, certLightboxLabels } from "./certLightbox";
import { button } from "./ui";

// The modal and the lightbox (Radix) are only downloaded when first opened.
const loadModal = () => import("./CertModal");
const CertModal = dynamic(() => loadModal().then((m) => m.CertModal), { ssr: false });
const Lightbox = dynamic(() => import("./Lightbox").then((m) => m.Lightbox), { ssr: false });

type CertFilter = CertCategory | "All";

const PARAM = "certs";

function parseFilter(value: string | null): CertFilter {
  const match = certCategories.find((c) => c.toLowerCase() === value?.trim().toLowerCase());
  return match ?? "All";
}

/** Keeps ?certs=<category> in the address bar while the modal is open, without adding history entries. */
function writeParam(value: string | null) {
  const url = new URL(window.location.href);
  if (value === null) url.searchParams.delete(PARAM);
  else url.searchParams.set(PARAM, value);
  window.history.replaceState(window.history.state, "", url);
}

/**
 * Featured certificates (swipe carousel on phones, grid from 768px), the
 * "View all" button and the searchable modal. Supports deep links such as
 * /?certs=english, which open the modal already filtered.
 */
export function CertShowcase() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<CertFilter>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [modalMounted, setModalMounted] = useState(false);
  const slides = useMemo(() => certLightboxItems(featuredCertifications), []);

  useEffect(() => {
    const sync = () => {
      const value = new URLSearchParams(window.location.search).get(PARAM);
      setOpen(value !== null);
      if (value !== null) {
        setFilter(parseFilter(value));
        setModalMounted(true);
      }
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const changeOpen = useCallback(
    (next: boolean) => {
      setOpen(next);
      writeParam(next ? filter.toLowerCase() : null);
    },
    [filter],
  );

  const changeFilter = useCallback((next: CertFilter) => {
    setFilter(next);
    writeParam(next.toLowerCase());
  }, []);

  const total = certifications.length;

  return (
    <>
      <ul className="scrollbar-none -mx-[var(--gutter)] flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-4 overflow-x-auto px-[var(--gutter)] pb-1 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4">
        {featuredCertifications.map((cert, i) => (
          <li key={`${cert.issuer}-${cert.name}`} className="w-[264px] shrink-0 snap-start md:w-auto">
            <CertCard cert={cert} onEnlarge={() => setLightbox(i)} />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-4 md:mt-12 md:flex-row md:items-center">
        <button
          type="button"
          onPointerEnter={() => void loadModal()}
          onFocus={() => void loadModal()}
          onClick={() => {
            setFilter("All");
            setModalMounted(true);
            setOpen(true);
            writeParam("all");
          }}
          className={`${button.secondary} w-full md:w-auto`}
          aria-haspopup="dialog"
        >
          <LayoutGrid size={18} aria-hidden="true" />
          {t(ui.viewAllCerts, { n: total })}
        </button>
        <p className="text-center text-base text-fg-3 md:hidden">{ui.certsHintMobile}</p>
        <p className="hidden text-sm text-fg-3 md:block">
          {t(ui.certsHint, { shown: featuredCertifications.length, n: total })}
        </p>
      </div>

      {modalMounted && <CertModal open={open} onOpenChange={changeOpen} filter={filter} onFilterChange={changeFilter} />}
      {lightbox !== null && (
        <Lightbox items={slides} index={lightbox} onIndexChange={setLightbox} labels={certLightboxLabels} />
      )}
    </>
  );
}
