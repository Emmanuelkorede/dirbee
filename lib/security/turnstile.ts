import "server-only";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileResponse = {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

type VerifyTurnstileOptions = {
  token: string;
  expectedHostname?: string;
  expectedAction?: string;
};

export async function verifyTurnstile({
  token,
  expectedHostname,
  expectedAction,
}: VerifyTurnstileOptions): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret || !token || token.length > 2048) {
    return false;
  }

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret,
        response: token,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as TurnstileResponse;

    if (!result.success) {
      return false;
    }

    if (
      expectedHostname &&
      result.hostname !== expectedHostname
    ) {
      return false;
    }

    if (
      expectedAction &&
      result.action !== expectedAction
    ) {
      return false;
    }

    return true;
  } catch {
    // Fail closed: verification errors must not bypass protection.
    return false;
  }
}