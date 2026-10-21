"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { ActionResult } from "@/types/action";
import type { SiteSettings } from "@/types/database";

import { DEFAULT_SETTINGS } from "./queries";
import { toggleSchema, updateSiteSettingsSchema } from "./validation";

type SettingsValues = Partial<Omit<SiteSettings, "id" | "updatedAt">>;

// Saves the given values. If the row does not exist yet it is created,
async function saveSettings(values: SettingsValues): Promise<ActionResult> {
  try {
    await db
      .insert(siteSettings)
      .values({ id: 1, ...DEFAULT_SETTINGS, ...values })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { ...values, updatedAt: new Date() },
      });

    revalidatePath("/", "layout"); // settings show up across the whole site
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("saveSettings failed:", error);
    return { success: false, error: "Unable to save the settings." };
  }
}

export async function updateSiteSettingsAction(
  input: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = updateSiteSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the settings.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const data = parsed.data;
  return saveSettings({
    reviewsEnabled: data.reviewsEnabled,
    showReviewsOnHomepage: data.showReviewsOnHomepage,
    contactEmail: data.contactEmail || null,
    instagramUrl: data.instagramUrl || null,
    tiktokUrl: data.tiktokUrl || null,
  });
}

export async function setReviewsEnabledAction(
  enabled: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = toggleSchema.safeParse(enabled);
  if (!parsed.success) return { success: false, error: "Invalid value." };

  return saveSettings({ reviewsEnabled: parsed.data });
}

export async function setShowReviewsOnHomepageAction(
  enabled: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = toggleSchema.safeParse(enabled);
  if (!parsed.success) return { success: false, error: "Invalid value." };

  return saveSettings({ showReviewsOnHomepage: parsed.data });
}