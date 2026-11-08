import { person } from "../content";

/** Social preview image, rendered at build time by src/app/og.png/route.tsx. */
export const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: `${person.name} — ${person.title}`,
};
