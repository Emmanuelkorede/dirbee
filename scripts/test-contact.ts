// Turnstile only:        npx tsx scripts/test-contact.ts
// Also send real email:  npx tsx scripts/test-contact.ts --send
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { verifyTurnstileToken } = await import("../lib/security/turnstile");

  // Cloudflare's test secrets. They accept any token, so the widget is not needed.
  process.env.TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA";
  console.log(
    "1. Always-pass key (expect true): ",
    await verifyTurnstileToken("XXXX.DUMMY.TOKEN.XXXX"),
  );

  process.env.TURNSTILE_SECRET_KEY = "2x0000000000000000000000000000000AA";
  console.log(
    "2. Always-fail key (expect false):",
    await verifyTurnstileToken("XXXX.DUMMY.TOKEN.XXXX"),
  );

  console.log("3. Empty token (expect false):    ", await verifyTurnstileToken(""));

  if (!process.argv.includes("--send")) {
    console.log("\nSkipped the email test. Add --send to send a real email.");
    return;
  }

  const { sendContactNotification } = await import("../lib/email/resend");

  const result = await sendContactNotification({
    fullName: "Test Visitor",
    email: "test@example.com",
    artistName: "Test Artist",
    company: "",
    projectType: "music-video",
    projectDescription: "This is a test message from scripts/test-contact.ts.",
    budget: "3k-5k",
    location: "Lagos, Nigeria",
    additionalMessage: "",
  });

  console.log("\n4. Email result:", result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});