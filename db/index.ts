import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

import { getDatabaseEnv } from "@/lib/env";
import * as schema from "./schema";

// Node needs this for the Pool's WebSocket (Neon documents this setup).
neonConfig.webSocketConstructor = ws;

const { databaseUrl } = getDatabaseEnv();

export const pool = new Pool({ connectionString: databaseUrl });

export const db = drizzle({ client: pool, schema });