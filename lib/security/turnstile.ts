import { getTurnstileEnv } from "@/lib/env";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Returns true only when Cloudflare confirms the token is real, fresh and unused.
// Any problem (network, bad config, bad token) returns false, so it fails closed.
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!token) return false;

  try {
    const { secretKey } = getTurnstileEnv();

    const response = await fetch(VERIFY_URL, {
      method: "POST",
      body: new URLSearchParams({ secret: secretKey, response: token }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    const result = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (!result.success) {
      // The codes tell you why: expired token, reused token, wrong secret...
      console.warn("Turnstile rejected a token:", result["error-codes"]);
    }

    return result.success === true;
  } catch (error) {
    console.error("verifyTurnstileToken failed:", error);
    return false;
  }
}