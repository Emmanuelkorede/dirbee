import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import { getDatabaseEnv } from "@/lib/env";
import * as schema from "./schema";

const { databaseUrl } = getDatabaseEnv();

export const pool = new Pool({ connectionString: databaseUrl });

export const db = drizzle({ client: pool, schema });