import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import type { SiteSettings } from "@/types/database";

// Same values scripts/seed.ts inserts. Both review flags stay off.
export const DEFAULT_SETTINGS = {
  reviewsEnabled: true,
  showReviewsOnHomepage: true,
  contactEmail: "officialdirectorbee@gmail.com",
  instagramUrl: "https://www.instagram.com/directorbee_",
  tiktokUrl: "https://www.tiktok.com/@directorbee_",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);

  if (row) return row;

  // The row is missing (the seed has not run). Behave as if it exists with the
  // seed defaults. Nothing is written here; the first save creates the row.
  console.warn("site_settings row is missing. Run scripts/seed.ts.");
  return { id: 1, ...DEFAULT_SETTINGS, updatedAt: new Date(0) };
}