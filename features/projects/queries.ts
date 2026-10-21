import "server-only";

import { and, asc, desc, eq, inArray, ne, type SQL } from "drizzle-orm";

import { db } from "@/db";
import { artists, clients, projectArtists, projects } from "@/db/schema";
import type { Project } from "@/types/database";
import type { ProjectDetail, ProjectWithArtists } from "./types";
import { projectIdSchema } from "./validation";

const isPublished = eq(projects.status, "published");

// Public ordering used by every list.
const publicOrder = [asc(projects.sortOrder), desc(projects.publishedAt)];

// Attach the artists to a list of projects with one extra query.
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
    artists: links.filter((l) => l.projectId === row.id).map((l) => l.artist),
  }));
}

// One project with its artists and client.
async function getDetail(where: SQL | undefined): Promise<ProjectDetail | null> {
  const [row] = await db
    .select({ project: projects, client: clients })
    .from(projects)
    .leftJoin(clients, eq(clients.id, projects.clientId))
    .where(where)
    .limit(1);

  if (!row) return null;

  const [withArtists] = await addArtists([row.project]);
  return { ...withArtists, client: row.client };
}

//  Public (published only) 

export async function getPublishedProjects() {
  const rows = await db
    .select()
    .from(projects)
    .where(isPublished)
    .orderBy(...publicOrder);

  return addArtists(rows);
}

export async function getFeaturedProjects() {
  const rows = await db
    .select()
    .from(projects)
    .where(and(isPublished, eq(projects.isFeatured, true)))
    .orderBy(asc(projects.featuredOrder));

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

// Other published projects that share at least one artist with this one.
// inArray(...) with a subquery means a project only appears once,
// even when it shares two artists with this project.
export async function getRelatedProjects(projectId: string, limit = 6) {
  if (!projectIdSchema.safeParse(projectId).success) return [];

  const thisProjectsArtists = db
    .select({ id: projectArtists.artistId })
    .from(projectArtists)
    .where(eq(projectArtists.projectId, projectId));

  const projectsWithThoseArtists = db
    .select({ id: projectArtists.projectId })
    .from(projectArtists)
    .where(inArray(projectArtists.artistId, thisProjectsArtists));

  const rows = await db
    .select()
    .from(projects)
    .where(
      and(
        ne(projects.id, projectId),
        isPublished,
        inArray(projects.id, projectsWithThoseArtists),
      ),
    )
    .orderBy(...publicOrder)
    .limit(limit);

  return addArtists(rows);
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