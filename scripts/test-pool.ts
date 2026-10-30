// Run: 
import { config } from "dotenv";

config({ path: ".env.local" });
 
async function main() {
  const { neonConfig, Pool } = await import("@neondatabase/serverless");
  const { default: ws } = await import("ws");

  console.log("Node:", process.version, "| built-in WebSocket:", typeof globalThis.WebSocket);

  const tries = [
    ["built-in WebSocket", undefined],
    ["ws package", ws],
  ] as const;

  for (const [name, constructor] of tries) {
    neonConfig.webSocketConstructor = constructor as never;
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    try {
      const result = await pool.query("select now() as now");
      console.log(`${name}: OK`, result.rows[0]);
    } catch (error) {
      console.log(`${name}: FAILED`, error);
    } finally {
      await pool.end();
    }
  }
}

main();