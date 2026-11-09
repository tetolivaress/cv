"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { RotateCcw, Search, SearchX, X } from "lucide-react";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import type { CertCategory, Certification } from "@/content/types";
import { t } from "@/content/format";
import { cn } from "@/lib/cn";
import { CertCard } from "./CertCard";
import { certLightboxItems, certLightboxLabels } from "./certLightbox";
import { Lightbox } from "./Lightbox";
import { useSite } from "./site/SiteProvider";
import { button } from "./ui";

export type CertFilter = CertCategory | "All";

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function matches(cert: Certification, categoryLabel: string, query: string) {
  if (!query) return true;
  const haystack = normalize([cert.name, cert.issuer, cert.category, categoryLabel, cert.date ?? ""].join(" "));
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filter: CertFilter;
  onFilterChange: (filter: CertFilter) => void;
  certifications: Certification[];
  categories: CertCategory[];
  yearRange: string;
}

/**
 * Pencil "CertModal": full-screen sheet on phones, centered modal (max 1100px)
 * from 768px. Category chips + search; clicking an image opens the lightbox.
 */
export function CertModal({ open, onOpenChange, filter, onFilterChange, certifications, categories, yearRange }: Props) {
  const { ui } = useSite();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const out = { All: certifications.length } as Record<CertFilter, number>;
    for (const category of categories) out[category] = certifications.filter((c) => c.category === category).length;
    return out;
  }, [certifications, categories]);
  const filters: CertFilter[] = ["All", ...categories];
  const label = (value: CertFilter) => (value === "All" ? ui.certs.all : ui.certs.categories[value]);
  const subtitle = t(ui.certs.subtitle, { n: certifications.length, range: yearRange }).replace(/ · $/, "");

  const results = useMemo(
    () =>
      certifications.filter(
        (c) => (filter === "All" || c.category === filter) && matches(c, ui.certs.categories[c.category], deferredQuery.trim()),
      ),
    [certifications, filter, deferredQuery, ui],
  );
  const slides = useMemo(() => certLightboxItems(results, ui), [results, ui]);

  const reset = () => {
    setQuery("");
    onFilterChange("All");
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-overlay backdrop-blur-[3px] animate-fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          // Focus the dialog itself (not the close button) so phones don't pop the
          // keyboard and the first Tab still lands on the first control.
          ref={contentRef}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            contentRef.current?.focus();
          }}
          tabIndex={-1}
          className={cn(
            "fixed inset-0 z-50 flex flex-col overflow-hidden bg-surface outline-none animate-sheet-in",
            "pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]",
            "md:inset-auto md:left-1/2 md:top-1/2 md:h-[min(1000px,calc(100dvh-96px))] md:w-[min(1100px,calc(100vw-64px))] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:p-0 md:shadow-modal md:ring-1 md:ring-line md:animate-pop-in",
          )}
        >
          <div className="flex shrink-0 flex-col gap-4 border-b border-line bg-surface px-4 pb-4 pt-4 sm:px-5 md:px-7 md:pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <Dialog.Title className="text-[28px] leading-tight text-fg">{ui.certs.title}</Dialog.Title>
                <p className="text-sm text-fg-3">{subtitle}</p>
              </div>
              <Dialog.Close className={button.icon} aria-label={ui.certs.close}>
                <X size={22} aria-hidden="true" />
              </Dialog.Close>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row-reverse lg:items-center lg:justify-between">
              <label className="relative flex h-11 w-full items-center gap-2.5 rounded-xl bg-bg px-3.5 ring-1 ring-inset ring-line-strong focus-within:ring-2 focus-within:ring-accent-strong lg:w-[300px]">
                <Search size={18} aria-hidden="true" className="shrink-0 text-fg-3" />
                <span className="sr-only">{ui.certs.searchLabel}</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={ui.certs.search}
                  autoComplete="off"
                  enterKeyHint="search"
                  className="h-full min-w-0 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-fg-3 [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label={ui.certs.clearSearch}
                    className="-mr-2 flex size-9 items-center justify-center rounded-lg text-fg-2 hover:bg-surface-2"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
              </label>

              <div
                role="group"
                aria-label={ui.certs.filterLabel}
                className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-5 sm:px-5 lg:mx-0 lg:px-0"
              >
                {filters.map((value) => {
                  const active = filter === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onFilterChange(value)}
                      className={cn(
                        "flex h-11 shrink-0 items-center gap-2 rounded-full px-[18px] text-sm font-medium ring-1 ring-inset transition-colors duration-150",
                        active ? "bg-inverse text-on-inverse ring-inverse" : "text-fg ring-line-strong hover:bg-surface-2",
                      )}
                    >
                      {label(value)}
                      <span className={cn("font-mono text-xs", active ? "text-on-inverse" : "text-fg-3")}>{counts[value]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5 md:px-7 md:py-6">
            {results.length > 0 ? (
              <>
                <p className="mb-5 font-mono text-xs uppercase text-fg-3" aria-live="polite">
                  {t(ui.certs.showing, { n: results.length })}
                </p>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
                  {results.map((cert, i) => (
                    <li key={cert.key}>
                      <CertCard cert={cert} onEnlarge={() => setLightbox(i)} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3.5 p-6 text-center" aria-live="polite">
                <span className="flex size-16 items-center justify-center rounded-full bg-surface-2 text-fg-2">
                  <SearchX size={28} aria-hidden="true" />
                </span>
                <p className="max-w-[420px] text-[22px] text-fg">
                  {t(ui.certs.emptyTitle, { q: query || label(filter) })}
                </p>
                <p className="max-w-[380px] text-base leading-6 text-fg-2">
                  {t(ui.certs.emptyText, { n: certifications.length })}
                </p>
                <button type="button" onClick={reset} className={button.secondary}>
                  <RotateCcw size={18} aria-hidden="true" />
                  {ui.certs.clearFilters}
                </button>
              </div>
            )}
          </div>

          <Lightbox items={slides} index={lightbox} onIndexChange={setLightbox} labels={certLightboxLabels(ui)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
