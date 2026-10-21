// Run: npx tsx scripts/test-wistia.ts
// Or with another link: npx tsx scripts/test-wistia.ts "https://....wistia.com/s/xxxx"
import { config } from "dotenv";

// Same idea as seed.ts: load .env.local BEFORE importing anything that reads it.
config({ path: ".env.local" });

const DEFAULT_URL = "https://officialdirectorbee.wistia.com/s/wgqub673c5qsxio";

async function main() {
  const {
    extractShareLinkIdentifier,
    getWistiaMediaMetadata,
    resolveWistiaShareLink,
    validateWistiaShareUrl,
  } = await import("../lib/wistia/sync");
  const { getWistiaEmbed } = await import("../lib/wistia/embed");

  const url = process.argv[2] ?? DEFAULT_URL;
  console.log("URL:", url);

  // Step 1: URL check (no network)
  console.log("\n1. Valid Wistia link:", validateWistiaShareUrl(url));
  console.log("   Share slug (NOT the media ID):", extractShareLinkIdentifier(url));

  // Step 2: share link -> real media ID (oEmbed, no token needed)
  const resolved = await resolveWistiaShareLink(url);
  console.log("\n2. Resolved media ID:", resolved);
  if (!resolved.success) return;

  // Step 3: metadata (Data API, needs the token)
  const metadata = await getWistiaMediaMetadata(resolved.data);
  console.log("\n3. Metadata:", metadata);
  if (!metadata.success) return;

  // Step 4: what the player will use
  console.log(
    "\n4. Embed config:",
    getWistiaEmbed(metadata.data.mediaId, metadata.data.width, metadata.data.height),
  );

  // Step 5: raw fields, to confirm where dimensions and thumbnails come from
  const res = await fetch(
    `https://api.wistia.com/v1/medias/${resolved.data}.json`,
    { headers: { Authorization: `Bearer ${process.env.WISTIA_API_TOKEN}` } },
  );
  const raw = await res.json();
  console.log("\n5. Raw check");
  console.log("   type/status:", raw.type, "/", raw.status);
  console.log("   thumbnail:", raw.thumbnail);
  console.log(
    "   assets:",
    (raw.assets ?? []).map((a: Record<string, unknown>) => ({
      type: a.type,
      contentType: a.contentType,
      width: a.width,
      height: a.height,
    })),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});