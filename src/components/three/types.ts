import type { SectionKey } from "@/i18n/routes";

export type Shape3D = "ico" | "rings" | "boxes" | "octa" | "knot" | "spheres";

/** One card of the 3D carousel: the section's labels plus a few short lines drawn inside the portal. */
export interface Panel3D {
  key: PanelKey;
  /** DOM id of the section (shared with the plain site, so links and clean URLs work in both views). */
  id: string;
  /** "01"… for the numbered sections; empty for the stack evolution strip. */
  index: string;
  href: string;
  nav: string;
  eyebrow: string;
  title: string;
  description?: string;
  lines: string[];
  /** Accent of the card's world, glow and shapes. */
  tint: string;
  shape: Shape3D;
}

/** Every part of the home page, in page order: in the 3D view each one is a card of the carousel. */
export const PANEL_KEYS = ["hero", "evolution", "about", "experience", "projects", "skills", "certifications", "english", "contact"] as const satisfies readonly (SectionKey | "hero" | "evolution")[];
export type PanelKey = (typeof PANEL_KEYS)[number];
/** DOM id of the stack-evolution step of the 3D track (it has no URL of its own). */
export const EVOLUTION_ID = "evolution";
