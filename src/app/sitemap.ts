import type { MetadataRoute } from "next";
import { projects } from "@/content";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = getSiteUrl();
  const now = new Date();
  return [
    { url: `${url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${url}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
