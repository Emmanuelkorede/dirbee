import "server-only";

import { asc, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { clients, projects } from "@/db/schema";
import { clientIdSchema } from "./validation";

export async function getClients() {
  return db.select().from(clients).orderBy(asc(clients.name));
}

// For the admin list: includes how many projects use each client.
export async function getClientsWithProjectCount() {
  return db
    .select({
      id: clients.id,
      name: clients.name,
      slug: clients.slug,
      projectCount: count(projects.id),
    })
    .from(clients)
    .leftJoin(projects, eq(projects.clientId, clients.id))
    .groupBy(clients.id)
    .orderBy(asc(clients.name));
}

export async function getClientById(id: string) {
  if (!clientIdSchema.safeParse(id).success) return null;

  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);

  return client ?? null;
}

export async function getClientBySlug(slug: string) {
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.slug, slug))
    .limit(1);

  return client ?? null;
}