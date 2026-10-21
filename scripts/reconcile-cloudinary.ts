// Report only:            npx tsx scripts/reconcile-cloudinary.ts
// Also delete orphans:    npx tsx scripts/reconcile-cloudinary.ts --delete-orphans
import { config } from "dotenv";

// Load .env.local BEFORE importing anything that reads it (same idea as seed.ts).
config({ path: ".env.local" });

// An upload can be waiting for its database row, so never touch very new files.
const MIN_AGE_MINUTES = 60;

type RemoteAsset = { publicId: string; createdAt: string };

async function main() {
  const deleteOrphans = process.argv.includes("--delete-orphans");

  const { db, pool } = await import("../db");
  const { photos } = await import("../db/schema");
  const { cloudinary } = await import("../lib/cloudinary/client");
  const { deleteCloudinaryAsset, UPLOAD_FOLDER } = await import(
    "../lib/cloudinary/uploads"
  );

  // Walk through every page of assets under our folder.
  async function listRemoteAssets(): Promise<RemoteAsset[]> {
    const assets: RemoteAsset[] = [];
    let cursor: string | undefined;

    do {
      const page = await cloudinary.api.resources({
        type: "upload",
        resource_type: "image",
        prefix: `${UPLOAD_FOLDER}/`,
        max_results: 500,
        next_cursor: cursor,
      });

      for (const resource of page.resources) {
        assets.push({ publicId: resource.public_id, createdAt: resource.created_at });
      }
      cursor = page.next_cursor;
    } while (cursor);

    return assets;
  }

  try {
    const remote = await listRemoteAssets();
    const rows = await db
      .select({ id: photos.id, publicId: photos.cloudinaryPublicId })
      .from(photos);

    const dbIds = new Set(rows.map((row) => row.publicId));
    const remoteIds = new Set(remote.map((asset) => asset.publicId));

    // In Cloudinary but not in the database.
    const orphans = remote.filter((asset) => !dbIds.has(asset.publicId));
    const cutoff = Date.now() - MIN_AGE_MINUTES * 60 * 1000;
    const oldOrphans = orphans.filter(
      (asset) => new Date(asset.createdAt).getTime() < cutoff,
    );

    // In the database but not in Cloudinary.
    const missing = rows.filter((row) => !remoteIds.has(row.publicId));

    console.log(`Cloudinary assets: ${remote.length}`);
    console.log(`Database photos:   ${rows.length}`);

    console.log(`\nOrphans (in Cloudinary, no database row): ${orphans.length}`);
    for (const asset of orphans) {
      const tooNew = !oldOrphans.includes(asset);
      console.log(`  ${asset.publicId}  (${asset.createdAt})${tooNew ? "  [too new to delete]" : ""}`);
    }

    console.log(`\nMissing (database row, no Cloudinary asset): ${missing.length}`);
    for (const row of missing) {
      console.log(`  photo ${row.id}  ${row.publicId}`);
    }
    if (missing.length > 0) {
      console.log("  -> Delete these in the admin. Deleting an already-gone image counts as success.");
    }

    if (!deleteOrphans) {
      if (oldOrphans.length > 0) {
        console.log(`\n${oldOrphans.length} orphan(s) can be removed. Re-run with --delete-orphans.`);
      }
      return;
    }

    console.log(`\nDeleting ${oldOrphans.length} orphan(s)...`);
    for (const asset of oldOrphans) {
      const result = await deleteCloudinaryAsset(asset.publicId);
      console.log(
        `  ${asset.publicId}: ${result.success ? result.data : `FAILED - ${result.error}`}`,
      );
    }
  } finally {
    await pool.end(); // the WebSocket pool keeps the script alive otherwise
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});