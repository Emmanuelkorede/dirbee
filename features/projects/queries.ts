import "server-only";

import { and, asc, desc, eq, inArray, type SQL } from "drizzle-orm";

import { db } from "@/db";
import { artists, clients, projectArtists, projectClients, projects } from "@/db/schema";
import type { Project } from "@/types/database";
import type { ProjectDetail, ProjectWithArtists } from "./types";
import { projectIdSchema } from "./validation";

const isPublished = eq(projects.status, "published");

// Public ordering used by every list.
const publicOrder = [asc(projects.sortOrder), desc(projects.publishedAt)];

// Attach the people (artists or starring) to a list of projects with one extra query.
async function addArtists(rows: Project[]): Promise<ProjectWithArtists[]> {
  if (rows.length === 0) return [];

  const links = await db
    .select({ projectId: projectArtists.projectId, artist: artists })
    .from(projectArtists)
    .innerJoin(artists, eq(artists.id, projectArtists.artistId))
    .where(inArray(projectArtists.projectId, rows.map((row) => row.id)))
    .orderBy(asc(projectArtists.sortOrder));

  return rows.map((row) => ({
    ...row,
    artists: links.filter((link) => link.projectId === row.id).map((link) => link.artist),
  }));
}

// One project with its people and clients.
async function getDetail(where: SQL | undefined): Promise<ProjectDetail | null> {
  const [project] = await db.select().from(projects).where(where).limit(1);
  if (!project) return null;

  const [withArtists] = await addArtists([project]);

  const clientRows = await db
    .select({ client: clients })
    .from(projectClients)
    .innerJoin(clients, eq(clients.id, projectClients.clientId))
    .where(eq(projectClients.projectId, project.id))
    .orderBy(asc(projectClients.sortOrder));

  return { ...withArtists, clients: clientRows.map((row) => row.client) };
}

//  Public (published only) 

export async function getPublishedProjects() {
  const rows = await db.select().from(projects).where(isPublished).orderBy(...publicOrder);
  return addArtists(rows);
}

export async function getFeaturedProjects(limit = 6) {
  const rows = await db
    .select()
    .from(projects)
    .where(and(isPublished, eq(projects.isFeatured, true)))
    .orderBy(asc(projects.featuredOrder))
    .limit(limit);

  return addArtists(rows);
}

// Public project page. Drafts return null.
export async function getProjectBySlug(slug: string) {
  return getDetail(and(eq(projects.slug, slug), isPublished));
}

export async function getProjectsByArtist(artistId: string) {
  if (!projectIdSchema.safeParse(artistId).success) return [];

  const rows = await db
    .select()
    .from(projects)
    .where(
      and(
        isPublished,
        inArray(
          projects.id,
          db
            .select({ id: projectArtists.projectId })
            .from(projectArtists)
            .where(eq(projectArtists.artistId, artistId)),
        ),
      ),
    )
    .orderBy(...publicOrder);

  return addArtists(rows);
}

// Other published projects that share at least one person with this one.
export async function getRelatedProjects(projectId: string, limit = 6) {
  if (!projectIdSchema.safeParse(projectId).success) return [];

  const mine = await db
    .select({ artistId: projectArtists.artistId })
    .from(projectArtists)
    .where(eq(projectArtists.projectId, projectId));

  const artistIds = mine.map((row) => row.artistId);
  if (artistIds.length === 0) return [];

  // selectDistinct: a project shared through two people appears once.
  const shared = await db
    .selectDistinct({ projectId: projectArtists.projectId })
    .from(projectArtists)
    .where(inArray(projectArtists.artistId, artistIds));

  const relatedIds = shared.map((row) => row.projectId).filter((id) => id !== projectId);
  if (relatedIds.length === 0) return [];

  const rows = await db
    .select()
    .from(projects)
    .where(and(inArray(projects.id, relatedIds), isPublished))
    .orderBy(...publicOrder)
    .limit(limit);

  return addArtists(rows);
}

// For the director page: names from published projects. Only "Artist" people, not Starring.
export async function getPublishedNames() {
  const people = await db
    .selectDistinct({ name: artists.name })
    .from(artists)
    .innerJoin(projectArtists, eq(projectArtists.artistId, artists.id))
    .innerJoin(projects, eq(projects.id, projectArtists.projectId))
    .where(and(isPublished, eq(artists.kind, "artist")))
    .orderBy(asc(artists.name));

  const clientRows = await db
    .selectDistinct({ name: clients.name })
    .from(clients)
    .innerJoin(projectClients, eq(projectClients.clientId, clients.id))
    .innerJoin(projects, eq(projects.id, projectClients.projectId))
    .where(isPublished)
    .orderBy(asc(clients.name));

  return {
    artists: people.map((person) => person.name),
    clients: clientRows.map((client) => client.name),
  };
}

//  Admin (includes drafts) 

export async function getAdminProjects() {
  const rows = await db.select().from(projects).orderBy(desc(projects.createdAt));
  return addArtists(rows);
}

export async function getProjectById(id: string) {
  if (!projectIdSchema.safeParse(id).success) return null;
  return getDetail(eq(projects.id, id));
}