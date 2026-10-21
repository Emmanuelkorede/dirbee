"use server";

import  z  from "zod";

import { eq, inArray, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { photos, photoShoots } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  deleteCloudinaryAsset,
  getUploadedImage,
} from "@/lib/cloudinary/uploads";
import {
  duplicateError,
  getPgErrorCode,
  PG_FOREIGN_KEY_VIOLATION,
  PG_UNIQUE_VIOLATION,
} from "@/lib/db-errors";
import { generateSlug } from "@/lib/utils";
import { slugSchema } from "@/lib/validation";
import type { ActionResult } from "@/types/action";
import type { Photo } from "@/types/database";

import {
  addPhotoSchema,
  photoIdSchema,
  photoShootIdSchema,
  photoShootInputSchema,
  reorderPhotosSchema,
  updatePhotoSchema,
  updatePhotoShootSchema,
} from "./validation";

const TITLE_ERROR = "Title must contain letters or numbers.";

type Failure = Extract<ActionResult, { success: false }>;

function invalidInput(error: z.ZodError, message: string): Failure {
  return {
    success: false,
    error: message,
    fieldErrors: z.flattenError(error).fieldErrors,
  };
}

function revalidatePhotoPages() {
  revalidatePath("/photography", "layout");
  revalidatePath("/admin/photography", "layout");
}

//  Shoots 

export async function createPhotoShootAction(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = photoShootInputSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed.error, "Please check the shoot details.");

  const slug = generateSlug(parsed.data.title);
  if (!slugSchema.safeParse(slug).success) {
    return { success: false, error: TITLE_ERROR, fieldErrors: { title: [TITLE_ERROR] } };
  }

  try {
    const [shoot] = await db
      .insert(photoShoots)
      .values({
        title: parsed.data.title,
        slug,
        description: parsed.data.description || null,
      })
      .returning({ id: photoShoots.id });

    revalidatePhotoPages();
    return { success: true, data: { id: shoot.id } };
  } catch (error) {
    if (getPgErrorCode(error) === PG_UNIQUE_VIOLATION) {
      const message = duplicateError("Photo shoot");
      return { success: false, error: message, fieldErrors: { title: [message] } };
    }
    console.error("createPhotoShootAction failed:", error);
    return { success: false, error: "Unable to create the shoot." };
  }
}

export async function updatePhotoShootAction(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = updatePhotoShootSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed.error, "Please check the shoot details.");

  const slug = generateSlug(parsed.data.title);
  if (!slugSchema.safeParse(slug).success) {
    return { success: false, error: TITLE_ERROR, fieldErrors: { title: [TITLE_ERROR] } };
  }

  try {
    const updated = await db
      .update(photoShoots)
      .set({
        title: parsed.data.title,
        slug,
        description: parsed.data.description || null,
      })
      .where(eq(photoShoots.id, parsed.data.id))
      .returning({ id: photoShoots.id });

    if (updated.length === 0) return { success: false, error: "Shoot not found." };

    revalidatePhotoPages();
    return { success: true };
  } catch (error) {
    if (getPgErrorCode(error) === PG_UNIQUE_VIOLATION) {
      const message = duplicateError("Photo shoot");
      return { success: false, error: message, fieldErrors: { title: [message] } };
    }
    console.error("updatePhotoShootAction failed:", error);
    return { success: false, error: "Unable to update the shoot." };
  }
}

// Publish and unpublish share one helper.
async function changeShootStatus(
  id: string,
  status: "draft" | "published",
): Promise<ActionResult> {
  await requireAdmin();

  const parsedId = photoShootIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Invalid shoot." };

  try {
    const [shoot] = await db
      .select({ publishedAt: photoShoots.publishedAt })
      .from(photoShoots)
      .where(eq(photoShoots.id, parsedId.data))
      .limit(1);
    if (!shoot) return { success: false, error: "Shoot not found." };

    await db
      .update(photoShoots)
      .set({
        status,
        // The database requires a date on published shoots. 
        publishedAt: shoot.publishedAt ?? (status === "published" ? new Date() : null),
      })
      .where(eq(photoShoots.id, parsedId.data));

    revalidatePhotoPages();
    return { success: true };
  } catch (error) {
    console.error("changeShootStatus failed:", error);
    return { success: false, error: "Unable to change the shoot status." };
  }
}

export async function publishPhotoShootAction(id: string) {
  return changeShootStatus(id, "published");
}

export async function unpublishPhotoShootAction(id: string) {
  return changeShootStatus(id, "draft");
}

//  Photos 

// Call this AFTER the browser has uploaded the file to Cloudinary.
export async function addPhotoRecordAction(input: unknown): Promise<ActionResult<Photo>> {
  await requireAdmin();

  const parsed = addPhotoSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed.error, "Please check the photo details.");
  const data = parsed.data;

  const [shoot] = await db
    .select({ id: photoShoots.id })
    .from(photoShoots)
    .where(eq(photoShoots.id, data.shootId))
    .limit(1);
  if (!shoot) return { success: false, error: "Shoot not found." };

  // Take the real URL, size and dimensions from Cloudinary, not from the browser.
  const image = await getUploadedImage(data.cloudinaryPublicId);
  if (!image.success) return { success: false, error: image.error };

  try {
    const [last] = await db
      .select({ value: max(photos.displayOrder) })
      .from(photos)
      .where(eq(photos.shootId, data.shootId));

    const [photo] = await db
      .insert(photos)
      .values({
        shootId: data.shootId,
        cloudinaryPublicId: data.cloudinaryPublicId,
        altText: data.altText,
        caption: data.caption || null,
        displayOrder: (last?.value ?? -1) + 1, // goes to the end
        ...image.data,
      })
      .returning();

    revalidatePhotoPages();
    return { success: true, data: photo };
  } catch (error) {
    const code = getPgErrorCode(error);
    if (code === PG_UNIQUE_VIOLATION) {
      return { success: false, error: "This image was already added." };
    }
    if (code === PG_FOREIGN_KEY_VIOLATION) {
      return { success: false, error: "Shoot not found." };
    }
    console.error("addPhotoRecordAction failed:", error);
    return { success: false, error: "Unable to save the photo." };
  }
}

export async function updatePhotoAction(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = updatePhotoSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed.error, "Please check the photo details.");

  try {
    const updated = await db
      .update(photos)
      .set({ altText: parsed.data.altText, caption: parsed.data.caption || null })
      .where(eq(photos.id, parsed.data.id))
      .returning({ id: photos.id });

    if (updated.length === 0) return { success: false, error: "Photo not found." };

    revalidatePhotoPages();
    return { success: true };
  } catch (error) {
    console.error("updatePhotoAction failed:", error);
    return { success: false, error: "Unable to update the photo." };
  }
}

// Order: Cloudinary first, database second.
// If Cloudinary fails the row stays, so clicking Delete again is the retry.
export async function deletePhotoAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const parsedId = photoIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Invalid photo." };

  try {
    const [photo] = await db
      .select({ id: photos.id, publicId: photos.cloudinaryPublicId })
      .from(photos)
      .where(eq(photos.id, parsedId.data))
      .limit(1);
    if (!photo) return { success: false, error: "Photo not found." };

    const remote = await deleteCloudinaryAsset(photo.publicId);
    if (!remote.success) {
      return {
        success: false,
        error: `The image could not be removed from Cloudinary, so nothing was deleted. Try again. (${remote.error})`,
      };
    }

    await db.delete(photos).where(eq(photos.id, photo.id));

    revalidatePhotoPages();
    return { success: true };
  } catch (error) {
    console.error("deletePhotoAction failed:", error);
    return { success: false, error: "Unable to delete the photo." };
  }
}

export async function reorderPhotosAction(input: unknown): Promise<ActionResult> {
  await requireAdmin();

  const parsed = reorderPhotosSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed.error, "Invalid photo order.");
  const { shootId, photoIds } = parsed.data;

  try {
    // The list must be exactly this shoot's photos, no more and no fewer.
    const current = await db
      .select({ id: photos.id })
      .from(photos)
      .where(eq(photos.shootId, shootId));

    const currentIds = new Set(current.map((photo) => photo.id));
    const sameList =
      currentIds.size === photoIds.length && photoIds.every((id) => currentIds.has(id));
    if (!sameList) {
      return { success: false, error: "The photo list is out of date. Refresh and try again." };
    }

    await db.transaction(async (tx) => {
      for (const [index, id] of photoIds.entries()) {
        await tx.update(photos).set({ displayOrder: index }).where(eq(photos.id, id));
      }
    });

    revalidatePhotoPages();
    return { success: true };
  } catch (error) {
    console.error("reorderPhotosAction failed:", error);
    return { success: false, error: "Unable to save the new order." };
  }
}

//  Delete a whole shoot 

export async function deletePhotoShootAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const parsedId = photoShootIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Invalid shoot." };

  try {
    const [shoot] = await db
      .select({ id: photoShoots.id })
      .from(photoShoots)
      .where(eq(photoShoots.id, parsedId.data))
      .limit(1);
    if (!shoot) return { success: false, error: "Shoot not found." };

    const shootPhotos = await db
      .select({ id: photos.id, publicId: photos.cloudinaryPublicId })
      .from(photos)
      .where(eq(photos.shootId, shoot.id));

    // 1. Remove every image from Cloudinary first.
    const results = await Promise.all(
      shootPhotos.map(async (photo) => ({
        id: photo.id,
        remote: await deleteCloudinaryAsset(photo.publicId),
      })),
    );

    const removedIds = results.filter((r) => r.remote.success).map((r) => r.id);
    const failedCount = results.length - removedIds.length;

    // 2. Something failed: forget only the photos Cloudinary confirmed,
    //    keep the shoot and the failed photos so the retry picks up where this stopped.
    if (failedCount > 0) {
      if (removedIds.length > 0) {
        await db.delete(photos).where(inArray(photos.id, removedIds));
      }
      revalidatePhotoPages();
      return {
        success: false,
        error: `${failedCount} of ${results.length} images could not be removed from Cloudinary. The shoot was kept. Try again.`,
      };
    }

    // 3. Everything is gone remotely: delete the rows (photos first, then the shoot).
    await db.transaction(async (tx) => {
      await tx.delete(photos).where(eq(photos.shootId, shoot.id));
      await tx.delete(photoShoots).where(eq(photoShoots.id, shoot.id));
    });

    revalidatePhotoPages();
    return { success: true };
  } catch (error) {
    console.error("deletePhotoShootAction failed:", error);
    return { success: false, error: "Unable to delete the shoot. Try again." };
  }
}