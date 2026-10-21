"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

import { db } from "@/db";
import { projectArtists, projects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  getPgErrorCode,
  PG_FOREIGN_KEY_VIOLATION,
  PG_UNIQUE_VIOLATION,
} from "@/lib/db-errors";
import { generateSlug } from "@/lib/utils";

import { slugSchema } from "@/lib/validation";

import type { ActionResult } from "@/types/action";
import { WistiaColumns } from "./types";

import { syncToColumns } from "./wistia";
import { NO_WISTIA } from "./wistia";

import {
  featuredIdsSchema,
  projectIdSchema,
  projectInputSchema,
  updateProjectSchema,
} from "./validation";

type Failure = Extract<ActionResult, { success: false }>;

const TITLE_ERROR = "Title must contain letters or numbers.";

function revalidateProjectPages() {
  revalidatePath("/", "layout"); // homepage featured projects
  revalidatePath("/work", "layout"); // list + project pages
  revalidatePath("/admin/projects", "layout");
}

function invalidInput(error: z.ZodError): Failure {
  return {
    success: false,
    error: "Please check the project details.",
    fieldErrors: z.flattenError(error).fieldErrors,
  };
}

function dbFailure(error: unknown, action: string): Failure {
  const code = getPgErrorCode(error);

  if (code === PG_UNIQUE_VIOLATION) {
    return { success: false, error: "A project with this title or video already exists." };
  }
  if (code === PG_FOREIGN_KEY_VIOLATION) {
    return { success: false, error: "A selected artist or the client no longer exists." };
  }

  console.error(`${action} project failed:`, error);
  return { success: false, error: `Unable to ${action} the project.` };
}


//  Create 
export async function createProjectAction(
  input: unknown,
): Promise<ActionResult<{ id: string; syncWarning?: string }>> {
  await requireAdmin();

  const parsed = projectInputSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed.error);
  const data = parsed.data;

  const slug = generateSlug(data.title);
  if (!slugSchema.safeParse(slug).success) {
    return { success: false, error: TITLE_ERROR, fieldErrors: { title: [TITLE_ERROR] } };
  }

  // The network call happens before the database write.
  let wistia = NO_WISTIA;
  let syncWarning: string | undefined;
  if (data.wistiaShareUrl) {
    const synced = await syncToColumns(data.wistiaShareUrl);
    wistia = synced.columns;
    syncWarning = synced.error;
  }

  

  try {
    const id = await db.transaction(async (tx) => {
      const [project] = await tx
        .insert(projects)
        .values({
          title: data.title,
          slug,
          description: data.description,
          clientId: data.clientId,
          projectType: data.projectType,
          projectYear: data.projectYear,
          credits: data.credits,
          ...wistia,
        })
        .returning({ id: projects.id });

      await tx.insert(projectArtists).values(
        data.artistIds.map((artistId, index) => ({
          projectId: project.id,
          artistId,
          sortOrder: index,
        })),
      );

      return project.id;
    });

    revalidateProjectPages();
    return { success: true, data: { id, syncWarning } };
  } catch (error) {
    return dbFailure(error, "create");
  }
}

//  Update 

export async function updateProjectAction(
  input: unknown,
): Promise<ActionResult<{ id: string; syncWarning?: string }>> {
  await requireAdmin();

  const parsed = updateProjectSchema.safeParse(input);
  if (!parsed.success) return invalidInput(parsed.error);
  const data = parsed.data;

  const slug = generateSlug(data.title);
  if (!slugSchema.safeParse(slug).success) {
    return { success: false, error: TITLE_ERROR, fieldErrors: { title: [TITLE_ERROR] } };
  }

  const [existing] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, data.id))
    .limit(1);
  if (!existing) return { success: false, error: "Project not found." };

  // Decide what happens to the Wistia columns.
  const newUrl = data.wistiaShareUrl || null;
  let wistia: Partial<WistiaColumns> = {}; // {} = leave the saved values alone
  let syncWarning: string | undefined;

  if (!newUrl) {
    if (existing.status === "published") {
      return { success: false, error: "A published project needs a video. Unpublish it first." };
    }
    wistia = NO_WISTIA;
  } else if (newUrl === existing.wistiaShareUrl && existing.wistiaMediaId) {
    // Same link and already synced: nothing to do.
  } else {
    const synced = await syncToColumns(newUrl);

    if (synced.error && existing.status === "published") {
      return { success: false, error: `Wistia sync failed: ${synced.error} Nothing was saved.` };
    }
    wistia = synced.columns;
    syncWarning = synced.error;
  }

    try {
    await db.transaction(async (tx) => {
      await tx
        .update(projects)
        .set({
          title: data.title,
          slug,
          description: data.description,
          clientId: data.clientId,
          projectType: data.projectType,
          projectYear: data.projectYear,
          credits: data.credits,
          ...wistia,
        })
        .where(eq(projects.id, data.id));

      // Replace the artist links.
      await tx.delete(projectArtists).where(eq(projectArtists.projectId, data.id));
      await tx.insert(projectArtists).values(
        data.artistIds.map((artistId, index) => ({
          projectId: data.id,
          artistId,
          sortOrder: index,
        })),
      );
    });

    revalidateProjectPages();
    return { success: true, data: { id: data.id, syncWarning } };
  } catch (error) {
    return dbFailure(error, "update");
  }
}

//  Retry Wistia sync 

export async function syncProjectWistiaAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const parsedId = projectIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Invalid project." };

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, parsedId.data))
    .limit(1);
  if (!project) return { success: false, error: "Project not found." };
  if (!project.wistiaShareUrl) {
    return { success: false, error: "Add a Wistia share link first." };
  }

  const synced = await syncToColumns(project.wistiaShareUrl);
  // A failed retry must not wipe data that was already saved.
  if (synced.error) return { success: false, error: synced.error };

  try {
    await db.update(projects).set(synced.columns).where(eq(projects.id, project.id));

    revalidateProjectPages();
    return { success: true };
  } catch (error) {
    return dbFailure(error, "update");
  }
}

// Publish / unpublish 

export async function publishProjectAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const parsedId = projectIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Invalid project." };

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, parsedId.data))
    .limit(1);
  if (!project) return { success: false, error: "Project not found." };

  if (!project.wistiaMediaId) {
    return { success: false, error: "Sync the Wistia video before publishing." };
  }

  try {
    await db
      .update(projects)
      .set({ status: "published", publishedAt: project.publishedAt ?? new Date() })
      .where(eq(projects.id, project.id));

    revalidateProjectPages();
    return { success: true };
  } catch (error) {
    return dbFailure(error, "publish");
  }
}

export async function unpublishProjectAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const parsedId = projectIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Invalid project." };

  try {
    // A draft can't stay on the homepage.
    const updated = await db
      .update(projects)
      .set({ status: "draft", isFeatured: false, featuredOrder: null })
      .where(eq(projects.id, parsedId.data))
      .returning({ id: projects.id });

    if (updated.length === 0) return { success: false, error: "Project not found." };

    revalidateProjectPages();
    return { success: true };
  } catch (error) {
    return dbFailure(error, "unpublish");
  }
}

//  Delete 
export async function deleteProjectAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const parsedId = projectIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Invalid project." };

  try {
    // project_artists rows are removed automatically (ON DELETE CASCADE).
    const deleted = await db
      .delete(projects)
      .where(eq(projects.id, parsedId.data))
      .returning({ id: projects.id });

    if (deleted.length === 0) return { success: false, error: "Project not found." };

    revalidateProjectPages();
    return { success: true };
  } catch (error) {
    return dbFailure(error, "delete");
  }
}

// ---------- Homepage featured order ----------

// Pass the full list in display order. It replaces the current featured list.
export async function setFeaturedProjectsAction(
  orderedIds: unknown,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = featuredIdsSchema.safeParse(orderedIds);
  if (!parsed.success) {
    return { success: false, error: z.flattenError(parsed.error).formErrors[0] ?? "Invalid list." };
  }
  const ids = parsed.data;

  // Every project must exist and be published.
  if (ids.length > 0) {
    const found = await db
      .select({ id: projects.id })
      .from(projects)
      .where(and(inArray(projects.id, ids), eq(projects.status, "published")));

    if (found.length !== ids.length) {
      return { success: false, error: "Only published projects can be featured." };
    }
  }

  try {
    await db.transaction(async (tx) => {
      // Clear everything first so the unique featured positions never clash.
      await tx
        .update(projects)
        .set({ isFeatured: false, featuredOrder: null })
        .where(eq(projects.isFeatured, true));

      for (const [index, id] of ids.entries()) {
        await tx
          .update(projects)
          .set({ isFeatured: true, featuredOrder: index + 1 })
          .where(eq(projects.id, id));
      }
    });

    revalidateProjectPages();
    return { success: true };
  } catch (error) {
    return dbFailure(error, "update");
  }

}