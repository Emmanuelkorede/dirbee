"use server";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

import { db } from "@/db";
import { artists, projectArtists } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  getPgErrorCode,
  PG_FOREIGN_KEY_VIOLATION,
  PG_UNIQUE_VIOLATION,
} from "@/lib/db-errors";
import { generateSlug } from "@/lib/utils";
import type { ActionResult } from "@/types/action";
import type { Artist } from "@/types/database";

import {
  artistIdSchema,
  artistInputSchema,
  slugSchema,
  updateArtistSchema,
} from "./validation";

function revalidateArtistPages() {
  revalidatePath("/admin/artists", "layout"); // list + edit pages
  revalidatePath("/admin/projects", "layout"); // project form artist selector
}

const NAME_ERROR = "Name must contain letters or numbers.";
const DUPLICATE_ERROR = "An artist with this name already exists.";

export async function createArtistAction(
  formData: FormData,
): Promise<ActionResult<Artist>> {
  await requireAdmin();

  const parsed = artistInputSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the artist details.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors, 
    };
  }

  const slug = generateSlug(parsed.data.name);
  if (!slugSchema.safeParse(slug).success) {
    return { success: false, error: NAME_ERROR, fieldErrors: { name: [NAME_ERROR] } };
  }

  try {
    const [artist] = await db
      .insert(artists)
      .values({ name: parsed.data.name, slug })
      .returning();

    revalidateArtistPages();
    return { success: true, data: artist };
  } catch (error) {
    if (getPgErrorCode(error) === PG_UNIQUE_VIOLATION) {
      return { success: false, error: DUPLICATE_ERROR, fieldErrors: { name: [DUPLICATE_ERROR] } };
    }
    console.error("createArtistAction failed:", error);
    return { success: false, error: "Unable to create the artist." };
  }
}

export async function updateArtistAction(
  formData: FormData,
): Promise<ActionResult<Artist>> {
  await requireAdmin();

  const parsed = updateArtistSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the artist details.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const slug = generateSlug(parsed.data.name);
  if (!slugSchema.safeParse(slug).success) {
    return { success: false, error: NAME_ERROR, fieldErrors: { name: [NAME_ERROR] } };
  }

  try {
    const [artist] = await db
      .update(artists)
      .set({ name: parsed.data.name, slug })
      .where(eq(artists.id, parsed.data.id))
      .returning();

    if (!artist) return { success: false, error: "Artist not found." };

    revalidateArtistPages();
    return { success: true, data: artist };
  } catch (error) {
    if (getPgErrorCode(error) === PG_UNIQUE_VIOLATION) {
      return { success: false, error: DUPLICATE_ERROR, fieldErrors: { name: [DUPLICATE_ERROR] } };
    }
    console.error("updateArtistAction failed:", error);
    return { success: false, error: "Unable to update the artist." };
  }
}

export async function deleteArtistAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const parsedId = artistIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Invalid artist." };

  try {
    const [usage] = await db
      .select({ projectCount: count() })
      .from(projectArtists)
      .where(eq(projectArtists.artistId, parsedId.data));

    if (usage.projectCount > 0) {
      return {
        success: false,
        error: `This artist is used by ${usage.projectCount} project(s). Remove them from those projects first.`,
      };
    }

    const deleted = await db
      .delete(artists)
      .where(eq(artists.id, parsedId.data))
      .returning({ id: artists.id });

    if (deleted.length === 0) return { success: false, error: "Artist not found." };

    revalidateArtistPages();
    return { success: true };
  } catch (error) {
    if (getPgErrorCode(error) === PG_FOREIGN_KEY_VIOLATION) {
      return {
        success: false,
        error: "This artist was just added to a project and can't be deleted.",
      };
    }
    console.error("deleteArtistAction failed:", error);
    return { success: false, error: "Unable to delete the artist." };
  }
}