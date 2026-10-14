
async function main() {
  // Load .env.local before importing the database module.
  const { loadEnvConfig } = await import("@next/env");
  loadEnvConfig(process.cwd());

  const [{ db }, { siteSettings }] = await Promise.all([
    import("../db"),
    import("../db/schema"),
  ]);

  const inserted = await db
    .insert(siteSettings)
    .values({
      id: 1,
      reviewsEnabled: false,
      showReviewsOnHomepage: false,
    })
    .onConflictDoNothing({
      target: siteSettings.id,
    })
    .returning({ id: siteSettings.id });

  if (inserted.length > 0) {
    console.log("House of Bee settings seeded successfully.");
  } else {
    console.log("Site settings already exist. No changes made.");
  }
}

main().catch((error: unknown) => {
  console.error("Failed to seed the database:", error);
  process.exitCode = 1;
});
