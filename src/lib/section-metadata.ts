import type { Metadata } from "next";
import { sections, type SectionKey } from "../content";

/** Section pages share the home page content, so they point search engines at "/". */
export function sectionMetadata(key: SectionKey): Metadata {
  return { title: sections[key].nav, alternates: { canonical: "/" } };
}
