/** Short, single-language summaries of each section for the 3D carousel cards (server only, like index.ts). */
import type { Locale } from "../i18n/config";
import { EVOLUTION_ID, PANEL_KEYS, type Panel3D, type PanelKey, type Shape3D } from "../components/three/types";
import { homePath, TOP, type SectionKey } from "../i18n/routes";
import { isPresent, parseDate, t } from "./format";
import { getContent } from "./index";

const LOOK: Record<PanelKey, { tint: string; shape: Shape3D }> = {
  hero: { tint: "#3ddcb4", shape: "spheres" },
  evolution: { tint: "#8fd14f", shape: "boxes" },
  contact: { tint: "#ff9d6f", shape: "rings" },
  about: { tint: "#4fc3e8", shape: "ico" },
  experience: { tint: "#5b9dff", shape: "rings" },
  projects: { tint: "#ff8f5c", shape: "boxes" },
  skills: { tint: "#b68cff", shape: "octa" },
  certifications: { tint: "#ffcf5c", shape: "knot" },
  english: { tint: "#ff6f9f", shape: "spheres" },
};

const clip = (text: string, max = 40) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

export function getPanels3d(locale: Locale): Panel3D[] {
  const c = getContent(locale);
  const year = (date?: string) => (isPresent(date) ? c.ui.present : (parseDate(date)?.year ?? ""));
  const eras = [...c.eras].reverse();
  const lines: Record<PanelKey, string[]> = {
    hero: [c.person.location, t(c.ui.yearsOfExperience, { n: c.yearsOfExperience }), c.languagesLine, c.currentJob?.company ? `${c.ui.currentlyAt} ${c.currentJob.company}` : ""].filter((line): line is string => Boolean(line)),
    evolution: eras.slice(-5).map((era) => `${era.from}–${era.to === "Now" ? c.ui.now : era.to} · ${era.label}`),
    contact: [c.person.email, ...c.socialLinks.slice(0, 4).map((link) => link.label)],
    about: c.stats.map((stat) => `${stat.value}  ${stat.label}`),
    experience: c.experience.slice(0, 5).map((job) => `${job.company ?? job.role} · ${year(job.start)}–${year(job.end)}`),
    projects: c.projects.slice(0, 5).map((project) => [project.name, project.stack.slice(0, 2).join(", ")].filter(Boolean).join(" · ")),
    skills: c.skills.slice(0, 5).map((group) => `${group.group}: ${group.items.slice(0, 3).join(", ")}`),
    certifications: [
      ...c.education.slice(0, 2).map((e) => `${e.degree} · ${e.year}`),
      ...c.galleryFeatured.slice(0, 3).map((cert) => `${cert.name} · ${cert.issuer}`),
    ],
    english: [
      ...c.person.languages.map((l) => `${l.name} · ${l.cefr && !l.native ? l.cefr : l.level}`),
      ...c.englishCertifications.slice(0, 3).map((cert) => cert.name),
    ],
  };
  return PANEL_KEYS.map((key): Panel3D => {
    if (key === "hero") {
      return { key, id: TOP, index: "00", href: homePath(locale), nav: c.ui.view3dIntro, eyebrow: c.ui.view3dIntro, title: c.person.name, description: c.person.tagline, lines: lines.hero.map((line) => clip(line)), ...LOOK.hero };
    }
    if (key === "evolution") {
      return { key, id: EVOLUTION_ID, index: "", href: homePath(locale), nav: c.ui.stackEvolution, eyebrow: `${eras[0]?.from ?? ""} → ${new Date().getFullYear()}`, title: c.ui.stackEvolution, description: c.person.title, lines: lines.evolution.map((line) => clip(line)), ...LOOK.evolution };
    }
    const s = c.sections[key as SectionKey];
    return {
      key,
      id: s.id,
      index: s.index,
      href: s.href,
      nav: s.nav,
      eyebrow: s.eyebrow,
      title: s.title,
      description: s.description,
      lines: lines[key].map((line) => clip(line)),
      ...LOOK[key],
    };
  });
}
