"use client";

import dynamic from "next/dynamic";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { getViewMode, setViewMode, subscribeViewMode, supportsWebGL, type ViewMode } from "@/lib/view-mode";
import type { Panel3D, PanelKey } from "./three/types";

// three.js, react-three-fiber, drei and react-spring are only downloaded when the 3D view is chosen.
const Track3D = dynamic(() => import("./three/Track3D"), {
  ssr: false,
  loading: () => <div className="h-[calc(100svh-var(--header-h))]" />,
});

interface Props {
  panels: Panel3D[];
  /** The plain hero: hidden (not unmounted, it holds the page's h1) while the 3D view is on. */
  hero: ReactNode;
  /** The plain page's sections, in order. */
  plain: ReactNode;
  /** One node per card, shown in full when the card is opened in the 3D view. */
  sections: Record<PanelKey, ReactNode>;
}

const serverView = (): ViewMode => "plain";

/**
 * The home page in the view picked with the header switch: stacked as a normal
 * page, or as the 3D carousel, where every part of the page (hero and contact
 * included) is a card. The server always renders the plain page.
 */
export function HomeView({ panels, hero, plain, sections }: Props) {
  const view = useSyncExternalStore(subscribeViewMode, getViewMode, serverView);

  useEffect(() => {
    // No WebGL (old device, blocked GPU): show the plain site, keep the saved choice.
    if (view === "3d" && !supportsWebGL()) setViewMode("plain", { remember: false });
  }, [view]);

  return (
    <>
      <div data-plain-only className="contents">
        {hero}
      </div>
      {view === "3d" ? (
        <Track3D panels={panels} sections={sections} />
      ) : (
        <div data-plain-only className="contents">
          {plain}
        </div>
      )}
    </>
  );
}
