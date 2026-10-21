import "server-only";

import { and, asc, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { photos, photoShoots } from "@/db/schema";
import type { PhotoShoot } from "@/types/database";
import { photoShootIdSchema } from "./validation";

const isPublished = eq(photoShoots.status, "published");
const shootOrder = [asc(photoShoots.sortOrder), desc(photoShoots.createdAt)];

// For lists: adds photoCount and a cover image to each shoot, using ONE extra query.
async function addPhotoSummary(shoots: PhotoShoot[]) {
  if (shoots.length === 0) return [];

  const rows = await db
    .select({ shootId: photos.shootId, imageUrl: photos.imageUrl })
    .from(photos)
    .where(inArray(photos.shootId, shoots.map((shoot) => shoot.id)))
    .orderBy(asc(photos.displayOrder), asc(photos.createdAt));

  return shoots.map((shoot) => {
    const own = rows.filter((row) => row.shootId === shoot.id);
    return { ...shoot, photoCount: own.length, coverUrl: own[0]?.imageUrl ?? null };
  });
}

// Admin only: no publish check. Public pages must use getPhotoShootBySlug.
export async function getPhotosByShoot(shootId: string) {
  if (!photoShootIdSchema.safeParse(shootId).success) return [];

  return db
    .select()
    .from(photos)
    .where(eq(photos.shootId, shootId))
    .orderBy(asc(photos.displayOrder), asc(photos.createdAt));
}

//  Admin (includes drafts) 

export async function getPhotoShoots() {
  const shoots = await db.select().from(photoShoots).orderBy(...shootOrder);
  return addPhotoSummary(shoots);
}

export async function getPhotoShootById(id: string) {
  if (!photoShootIdSchema.safeParse(id).success) return null;

  const [shoot] = await db
    .select()
    .from(photoShoots)
    .where(eq(photoShoots.id, id))
    .limit(1);
  if (!shoot) return null;

  return { ...shoot, photos: await getPhotosByShoot(shoot.id) };
}

//  Public (published only) 

export async function getPublishedPhotoShoots() {
  const shoots = await db
    .select()
    .from(photoShoots)
    .where(isPublished)
    .orderBy(...shootOrder);

  return addPhotoSummary(shoots);
}

// Drafts return null.
export async function getPhotoShootBySlug(slug: string) {
  const [shoot] = await db
    .select()
    .from(photoShoots)
    .where(and(eq(photoShoots.slug, slug), isPublished))
    .limit(1);
  if (!shoot) return null;

  return { ...shoot, photos: await getPhotosByShoot(shoot.id) };
}