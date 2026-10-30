"use server";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

import { db } from "@/db";
import { artists, projectArtists } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  duplicateError,
  getPgErrorCode,
  NAME_ERROR,
  PG_FOREIGN_KEY_VIOLATION,
  PG_UNIQUE_VIOLATION,
} from "@/lib/db-errors";
import { generateSlug } from "@/lib/utils";
import { slugSchema } from "@/lib/validation";
import type { ActionResult } from "@/types/action";
import type { Artist } from "@/types/database";

import { artistIdSchema, artistInputSchema, updateArtistSchema } from "./validation";

function revalidateArtistPages() {
  revalidatePath("/admin/artists", "layout");
  revalidatePath("/admin/projects", "layout"); // project form people picker
  revalidatePath("/work", "layout"); // public pages show these names
  revalidatePath("/", "layout");
}

export async function createArtistAction(formData: FormData): Promise<ActionResult<Artist>> {
  await requireAdmin();

  const parsed = artistInputSchema.safeParse({
    name: formData.get("name"),
    kind: formData.get("kind"),
  });
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the details.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const slug = generateSlug(parsed.data.name);
  if (!slugSchema.safeParse(slug).success) {
    return { success: false, error: NAME_ERROR, fieldErrors: { name: [NAME_ERROR] } };
  }

  try {
    const [person] = await db
      .insert(artists)
      .values({ name: parsed.data.name, slug, kind: parsed.data.kind })
      .returning();

    revalidateArtistPages();
    return { success: true, data: person };
  } catch (error) {
    if (getPgErrorCode(error) === PG_UNIQUE_VIOLATION) {
      const message = duplicateError("Talent");
      return { success: false, error: message, fieldErrors: { name: [message] } };
    }
    console.error("createArtistAction failed:", error);
    return { success: false, error: "Unable to add this person." };
  }
}

export async function updateArtistAction(formData: FormData): Promise<ActionResult<Artist>> {
  await requireAdmin();

  const parsed = updateArtistSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    kind: formData.get("kind"),
  });
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the details.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const slug = generateSlug(parsed.data.name);
  if (!slugSchema.safeParse(slug).success) {
    return { success: false, error: NAME_ERROR, fieldErrors: { name: [NAME_ERROR] } };
  }

  try {
    const [existing] = await db
      .select({ kind: artists.kind })
      .from(artists)
      .where(eq(artists.id, parsed.data.id))
      .limit(1);
    if (!existing) return { success: false, error: "Person not found." };

    // Switching Artist <-> Starring would break the projects they are on.
    if (existing.kind !== parsed.data.kind) {
      const [usage] = await db
        .select({ projectCount: count() })
        .from(projectArtists)
        .where(eq(projectArtists.artistId, parsed.data.id));

      if (usage.projectCount > 0) {
        const message = `Used by ${usage.projectCount} project(s). Remove them from those projects before changing the type.`;
        return { success: false, error: message, fieldErrors: { kind: [message] } };
      }
    }

    const [person] = await db
      .update(artists)
      .set({ name: parsed.data.name, slug, kind: parsed.data.kind })
      .where(eq(artists.id, parsed.data.id))
      .returning();

    revalidateArtistPages();
    return { success: true, data: person };
  } catch (error) {
    if (getPgErrorCode(error) === PG_UNIQUE_VIOLATION) {
      const message = duplicateError("Talent");
      return { success: false, error: message, fieldErrors: { name: [message] } };
    }
    console.error("updateArtistAction failed:", error);
    return { success: false, error: "Unable to update this person." };
  }
}

export async function deleteArtistAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const parsedId = artistIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Invalid person." };

  try {
    const [usage] = await db
      .select({ projectCount: count() })
      .from(projectArtists)
      .where(eq(projectArtists.artistId, parsedId.data));

    if (usage.projectCount > 0) {
      return {
        success: false,
        error: `Used by ${usage.projectCount} project(s). Remove them from those projects first.`,
      };
    }

    const deleted = await db
      .delete(artists)
      .where(eq(artists.id, parsedId.data))
      .returning({ id: artists.id });

    if (deleted.length === 0) return { success: false, error: "Person not found." };

    revalidateArtistPages();
    return { success: true };
  } catch (error) {
    if (getPgErrorCode(error) === PG_FOREIGN_KEY_VIOLATION) {
      return { success: false, error: "This person was just added to a project and can't be deleted." };
    }
    console.error("deleteArtistAction failed:", error);
    return { success: false, error: "Unable to delete this person." };
  }
}