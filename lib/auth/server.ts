import { createNeonAuth } from "@neondatabase/auth/next/server";

import { getNeonAuthEnv } from "@/lib/env";

const { baseUrl, cookieSecret } = getNeonAuthEnv();

export const auth = createNeonAuth({
  baseUrl,
  cookies: { secret: cookieSecret },
});