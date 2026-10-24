"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";

import { db } from "@/db";
import { clients } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getPgErrorCode, PG_UNIQUE_VIOLATION } from "@/lib/db-errors";
import { generateSlug } from "@/lib/utils";
import type { ActionResult } from "@/types/action";
import type { Client } from "@/types/database";

import {
  clientIdSchema,
  clientInputSchema,
  updateClientSchema,
} from "./validation";

import { slugSchema } from "@/lib/validation";

import { NAME_ERROR } from "@/lib/db-errors";
import { duplicateError } from "@/lib/db-errors";

function revalidateClientPages() {
  revalidatePath("/admin/clients", "layout");
  revalidatePath("/admin/projects", "layout"); 
  revalidatePath("/work", "layout");   
    revalidatePath("/", "layout"); 
}

const DUPLICATE_ERROR = duplicateError("Client")

export async function createClientAction(
  formData: FormData,
): Promise<ActionResult<Client>> {
  await requireAdmin();

  const parsed = clientInputSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the client details.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const slug = generateSlug(parsed.data.name);
  if (!slugSchema.safeParse(slug).success) {
    return { success: false, error: NAME_ERROR, fieldErrors: { name: [NAME_ERROR] } };
  }

  try {
    const [client] = await db
      .insert(clients)
      .values({ name: parsed.data.name, slug })
      .returning();

    revalidateClientPages();
    return { success: true, data: client };
  } catch (error) {
    if (getPgErrorCode(error) === PG_UNIQUE_VIOLATION) {
      return { success: false, error: DUPLICATE_ERROR, fieldErrors: { name: [DUPLICATE_ERROR] } };
    }
    console.error("createClientAction failed:", error);
    return { success: false, error: "Unable to create the client." };
  }
}

export async function updateClientAction(
  formData: FormData,
): Promise<ActionResult<Client>> {
  await requireAdmin();

  const parsed = updateClientSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the client details.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const slug = generateSlug(parsed.data.name);
  if (!slugSchema.safeParse(slug).success) {
    return { success: false, error: NAME_ERROR, fieldErrors: { name: [NAME_ERROR] } };
  }

  try {
    const [client] = await db
      .update(clients)
      .set({ name: parsed.data.name, slug })
      .where(eq(clients.id, parsed.data.id))
      .returning();

    if (!client) return { success: false, error: "Client not found." };

    revalidateClientPages();
    return { success: true, data: client };
  } catch (error) {
    if (getPgErrorCode(error) === PG_UNIQUE_VIOLATION) {
      return { success: false, error: DUPLICATE_ERROR, fieldErrors: { name: [DUPLICATE_ERROR] } };
    }
    console.error("updateClientAction failed:", error);
    return { success: false, error: "Unable to update the client." };
  }
}

export async function deleteClientAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const parsedId = clientIdSchema.safeParse(id);
  if (!parsedId.success) return { success: false, error: "Invalid client." };

  try {
    // The database sets client_id to null on any projects using this client.
    const deleted = await db
      .delete(clients)
      .where(eq(clients.id, parsedId.data))
      .returning({ id: clients.id });

    if (deleted.length === 0) return { success: false, error: "Client not found." };

    revalidateClientPages();
    return { success: true };
  } catch (error) {
    console.error("deleteClientAction failed:", error);
    return { success: false, error: "Unable to delete the client." };
  }
}