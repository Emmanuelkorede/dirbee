import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

async function main() {
  const db = drizzle(neon(process.env.DATABASE_URL!));
  const result = await db.execute(sql`select now() as now, version() as version`);
  console.log(result);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});