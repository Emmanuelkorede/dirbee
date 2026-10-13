import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { getDatabaseEnv } from "@/lib/env";

const { databaseUrl } = getDatabaseEnv();
const sql = neon(databaseUrl);

export const db = drizzle(sql, { schema });