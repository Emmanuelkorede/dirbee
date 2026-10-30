import type { MetadataRoute } from "next";

import { siteInfo } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/auth/", "/api/"],
    },
    sitemap: `${siteInfo.url}/sitemap.xml`,
  };
}