import type { MetadataRoute } from "next";

import { getPublishedPhotoShoots } from "@/features/photography/queries";
import { getPublishedProjects } from "@/features/projects/queries";
import { getSiteSettings } from "@/features/settings/queries";
import { siteInfo } from "@/lib/site";

// Rebuilt at most once an hour, so new projects show up without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, shoots, settings] = await Promise.all([
    getPublishedProjects(),
    getPublishedPhotoShoots(),
    getSiteSettings(),
  ]);

  const url = (path: string) => `${siteInfo.url}${path}`;

  // Pages that always have content.
  const paths = ["", "/director", "/about", "/contact"];

  // Pages that are only worth listing when they are not empty.
  if (projects.length > 0) paths.push("/work");
  if (shoots.length > 0) paths.push("/photography");
  if (settings.reviewsEnabled) paths.push("/reviews");

  return [
    ...paths.map((path) => ({ url: url(path) })),

    ...projects.map((project) => ({
      url: url(`/work/${project.slug}`),
      lastModified: project.updatedAt,
    })),

    ...shoots.map((shoot) => ({
      url: url(`/photography/${shoot.slug}`),
      lastModified: shoot.updatedAt,
    })),
  ];
}