"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Layers, MoveVertical, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { t } from "@/content/format";
import { cn } from "@/lib/cn";
import { pushPath, scrollToSection, sectionIdFromPath, TOP } from "@/lib/section-nav";
import { getTheme, subscribeTheme, type Theme } from "@/lib/theme";
import { getPortals, SECTIONS_EVENT, setPortals, subscribePortals, takePendingSection } from "@/lib/view-mode";
import { useSite } from "../site/SiteProvider";
import { button, eyebrow } from "../ui";
import Scene3D, { type Palette } from "./Scene3D";
import type { Panel3D, PanelKey } from "./types";

const PALETTES: Record<Theme, Palette> = {
  light: { base: "#e9eeec", text: "#0d1412", muted: "#33403b" },
  dark: { base: "#0d1513", text: "#ecf2ef", muted: "#b4c1bc" },
};

const subscribeReducedMotion = (callback: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Props {
  panels: Panel3D[];
  sections: Record<PanelKey, ReactNode>;
}

/**
 * The 3D view of the home page: hero, stack evolution, the sections and contact, one card each. A tall track gives the page something to
 * scroll; a stage stays pinned under the header while the scroll turns a ring
 * of cards, one per section. Each step of the track is an (empty) element with
 * the section's id, so header links, clean URLs and the active-section
 * highlight work exactly as on the plain page. The front card's section is
 * described in HTML next to the canvas and opens in full in a dialog. Vertical
 * scrolling turns the ring, and so do sideways wheel, swipe and arrow-key input.
 */
export default function Track3D({ panels, sections }: Props) {
  const { ui, person } = useSite();
  const count = panels.length;
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const [inView, setInView] = useState(true);
  const [open, setOpen] = useState<number | null>(null);
  // The contact step only takes the "contact" id once the plain footer has given it up (never two elements with one id).
  const [footerOut, setFooterOut] = useState(false);
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "light" as Theme);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const portals = useSyncExternalStore(subscribePortals, getPortals, () => true);
  const lite = !portals;

  // Scroll position → position in cards.
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const first = track.current?.firstElementChild;
      if (!track.current || !stage.current || !first) return;
      const pinnedAt = parseFloat(getComputedStyle(stage.current).top) || 0;
      const stepPx = first.getBoundingClientRect().height || 1;
      const position = Math.min(count - 1, Math.max(0, (pinnedAt - track.current.getBoundingClientRect().top) / stepPx));
      progress.current = position;
      setActive(Math.round(position));
      if (position > 0.15) setStarted(true);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count]);

  // The section elements changed: tell the header and side nav, and land on the section the visitor asked for.
  useEffect(() => {
    // The contact card's step takes over the section id from the (hidden) plain footer while this view is mounted.
    const footer = document.querySelector<HTMLElement>("[data-site-footer]");
    const footerId = footer?.id;
    footer?.removeAttribute("id");
    setFooterOut(true);
    window.dispatchEvent(new Event(SECTIONS_EVENT));
    const fromPath = sectionIdFromPath(window.location.pathname);
    const target = takePendingSection() ?? (fromPath === TOP ? null : fromPath);
    if (target) scrollToSection(target, { smooth: false, focus: false });
    return () => {
      if (footer && footerId) footer.id = footerId;
      // After the plain sections are back in the page.
      requestAnimationFrame(() => window.dispatchEvent(new Event(SECTIONS_EVENT)));
    };
  }, []);

  // Nothing is drawn while the stage is off screen (hero above, contact below).
  useEffect(() => {
    if (!stage.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const panel = panels[index];
      if (panel && scrollToSection(panel.id, { focus: false })) pushPath(panel.href);
    },
    [panels],
  );

  // Sideways input turns the ring too: a horizontal wheel or trackpad swipe, a finger swipe across the stage, and the arrow keys.
  // All of them move the page's own scroll, so there is still one source of truth for the position.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const stepPx = () => track.current?.firstElementChild?.getBoundingClientRect().height || window.innerHeight * 0.8;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 32 : event.deltaMode === 2 ? window.innerHeight : 1;
      window.scrollBy({ top: event.deltaX * unit, behavior: "instant" });
    };
    let touch: { x: number; y: number; scroll: number; axis: "x" | "y" | null } | null = null;
    const onTouchStart = (event: TouchEvent) => {
      const t = event.touches[0];
      touch = event.touches.length === 1 ? { x: t.clientX, y: t.clientY, scroll: window.scrollY, axis: null } : null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!touch) return;
      const dx = event.touches[0].clientX - touch.x;
      const dy = event.touches[0].clientY - touch.y;
      if (!touch.axis && Math.hypot(dx, dy) > 8) touch.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (touch.axis !== "x") return;
      event.preventDefault();
      // Swiping 60% of the stage's width turns the ring by one card.
      window.scrollTo({ top: touch.scroll - (dx / (el.clientWidth * 0.6)) * stepPx(), behavior: "instant" });
    };
    const onTouchEnd = () => {
      if (touch?.axis === "x") {
        const panel = panels[Math.round(progress.current)];
        if (panel) scrollToSection(panel.id, { focus: false });
      }
      touch = null;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [panels]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (open !== null || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable], [role='dialog'], [role='menu']")) return;
      // From the scroll position, not the `active` state: a key that arrives before React has re-run this effect would step from the previous card.
      const next = Math.round(progress.current) + (event.key === "ArrowRight" ? 1 : -1);
      if (next < 0 || next >= count) return;
      event.preventDefault();
      goTo(next);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, goTo, open]);

  const current = panels[active];
  const opened = open === null ? null : panels[open];
  const style = { "--stage": "calc(100svh - var(--header-h))", "--step": "80svh", height: `calc(${count - 1} * var(--step) + var(--stage))` } as CSSProperties;

  return (
    <section ref={track} aria-label={ui.view3dLabel} className="relative" style={style}>
      {panels.map((panel, i) => (
        <div
          key={panel.key}
          id={panel.id === TOP || (panel.key === "contact" && !footerOut) ? undefined : panel.id}
          className="pointer-events-none absolute inset-x-0 outline-none"
          style={{ top: `calc(${i} * var(--step))`, height: i === count - 1 ? "var(--stage)" : "var(--step)" }}
        />
      ))}

      <div ref={stage} className="sticky top-[var(--header-h)] h-(--stage) touch-pan-y overflow-hidden">
        {/* The plain hero (and its h1) is hidden in this view. */}
        <h1 className="sr-only">{person.name}</h1>
        <div className="absolute inset-0" data-scene={lite ? "lite" : "full"}>
          {/* Keyed: antialiasing is fixed when the WebGL context is created, so the two scenes each get their own. */}
          <Scene3D
            key={lite ? "lite" : "full"}
            panels={panels}
            progress={progress}
            active={active}
            open={open}
            palette={PALETTES[theme]}
            reducedMotion={reducedMotion}
            lite={lite}
            paused={!inView}
            onSelect={goTo}
            onOpen={setOpen}
          />
        </div>

        {/* Wide stages: the cards to the left of the front one fade into the page, so the caption stays readable. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-[48%] bg-linear-to-r from-bg from-60% to-transparent lg:block" />

        {/* The front card's section, as real text. Wide stages: left of the card. Tall stages: under it. */}
        <div className="wrap pointer-events-none absolute inset-0 flex items-end pb-5 landscape:items-center landscape:pb-0 lg:items-center lg:pb-0">
          <div
            key={current.key}
            aria-live="polite"
            className="pointer-events-auto flex w-full animate-sheet-in flex-col gap-3 landscape:max-w-[40%] lg:max-w-[min(380px,29%)] lg:gap-4"
          >
            <p className={eyebrow}>
              {[current.index, current.eyebrow].filter(Boolean).join(" — ")}
            </p>
            <h2 className="font-heading text-[26px] leading-[1.06] font-semibold tracking-[-0.025em] text-fg text-balance md:text-[34px] lg:text-[40px] landscape:max-lg:text-[22px]">
              {current.title}
            </h2>
            {current.description && (
              <p className="line-clamp-3 text-[15px] leading-normal text-fg-2 text-pretty md:text-base landscape:max-lg:hidden">{current.description}</p>
            )}
            <button type="button" className={cn(button.primarySm, "mt-1 w-fit")} onClick={() => setOpen(active)}>
              {t(ui.view3dOpen, { section: current.nav })}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <nav aria-label={ui.sectionIndex} className="absolute right-1 top-1/2 -translate-y-1/2 md:right-4">
          <ul className="flex flex-col">
            {panels.map((panel, i) => (
              <li key={panel.key}>
                <button
                  type="button"
                  aria-label={t(ui.view3dGoTo, { section: panel.nav })}
                  aria-current={i === active ? "location" : undefined}
                  title={panel.nav}
                  onClick={() => goTo(i)}
                  className="group flex size-11 items-center justify-center"
                >
                  <span
                    aria-hidden="true"
                    className={cn("w-1.5 rounded-full transition-all duration-200", i === active ? "h-6 bg-accent-strong" : "h-1.5 bg-line-strong group-hover:bg-fg-3")}
                  />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          aria-pressed={portals}
          title={ui.view3dPortalsHint}
          onClick={() => setPortals(!portals)}
          className={cn(
            "absolute left-3 top-3 flex h-11 items-center gap-2 rounded-full px-3.5 font-mono text-xs font-semibold ring-1 ring-inset ring-line transition-colors duration-200 md:left-6",
            portals ? "bg-surface-2 text-fg" : "bg-surface text-fg-3 hover:text-fg",
          )}
        >
          <Layers size={16} aria-hidden="true" />
          <span className="max-md:sr-only">{ui.view3dPortals}</span>
          <span aria-hidden="true" className={cn("size-2 rounded-full transition-colors duration-200", portals ? "bg-accent-strong" : "bg-line-strong")} />
        </button>

        <p
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-surface whitespace-nowrap px-3 py-1.5 font-mono text-xs text-fg-2 ring-1 ring-inset ring-line transition-opacity duration-300",
            started && "opacity-0",
          )}
        >
          <MoveVertical size={13} />
          {ui.view3dHint}
        </p>
      </div>

      <Dialog.Root open={opened !== null} onOpenChange={(next) => !next && setOpen(null)}>
        <Dialog.Portal>
          {/* Light veil: the opened card's world fills the canvas behind it. */}
          <Dialog.Overlay className="fixed inset-0 z-50 bg-overlay/40 animate-fade-in" />
          <Dialog.Content
            aria-describedby={undefined}
            className={cn(
              "fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-bg outline-none animate-sheet-in",
              "pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]",
              "md:inset-x-6 md:inset-y-6 md:rounded-3xl md:shadow-modal md:ring-1 md:ring-line md:animate-pop-in xl:inset-x-16",
            )}
          >
            <Dialog.Title className="sr-only">{opened?.nav}</Dialog.Title>
            <div className="sticky top-0 z-10 flex justify-end p-3 md:p-4">
              <Dialog.Close className={cn(button.icon, "bg-surface")} aria-label={ui.view3dClose}>
                <X size={22} aria-hidden="true" />
              </Dialog.Close>
            </div>
            <div className="-mt-[68px] md:-mt-[76px]">{opened && sections[opened.key as PanelKey]}</div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
