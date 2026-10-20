import "server-only";

import { asc, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { artists, projectArtists } from "@/db/schema";
import { artistIdSchema } from "./validation";

// Plain list, for the project form's artist selector.
export async function getArtists() {
  return db.select().from(artists).orderBy(asc(artists.name));
}

// Admin list, with usage counts so the UI can warn before deletion.
export async function getArtistsWithProjectCount() {
  return db
    .select({
      id: artists.id,
      name: artists.name,
      slug: artists.slug,
      projectCount: count(projectArtists.projectId),
    })
    .from(artists)
    .leftJoin(projectArtists, eq(projectArtists.artistId, artists.id))
    .groupBy(artists.id)
    .orderBy(asc(artists.name));
}

export async function getArtistById(id: string) {
  // Route params are untrusted; an invalid UUID would make Postgres throw.
  if (!artistIdSchema.safeParse(id).success) return null;

  const [artist] = await db
    .select()
    .from(artists)
    .where(eq(artists.id, id))
    .limit(1);

  return artist ?? null;
}

export async function getArtistBySlug(slug: string) {
  const [artist] = await db
    .select()
    .from(artists)
    .where(eq(artists.slug, slug))
    .limit(1);

  return artist ?? null;
}