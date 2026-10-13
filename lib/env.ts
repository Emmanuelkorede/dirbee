

function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `[env] Missing required environment variable: ${name}`,
    );
  }

  return value;
}

function requiredUrl(name: string): string {
  const value = required(name);

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error();
    }
  } catch {
    throw new Error(
      `[env] ${name} must be a valid HTTP or HTTPS URL.`,
    );
  }

  return value;
}

export function getDatabaseEnv() {
  const databaseUrl = required("DATABASE_URL");

  if (!/^postgres(?:ql)?:\/\//i.test(databaseUrl)) {
    throw new Error(
      "[env] DATABASE_URL must be a PostgreSQL connection URL.",
    );
  }

  return { databaseUrl };
}

export function getNeonAuthEnv() {
  return {
    baseUrl: requiredUrl("NEON_AUTH_BASE_URL"),
    cookieSecret: required("NEON_AUTH_COOKIE_SECRET"),
  };
}

export function getCloudinaryEnv() {
  return {
    cloudName: required("CLOUDINARY_CLOUD_NAME"),
    apiKey: required("CLOUDINARY_API_KEY"),
    apiSecret: required("CLOUDINARY_API_SECRET"),
  };
}

export function getResendEnv() {
  return {
    apiKey: required("RESEND_API_KEY"),
    fromEmail: required("FROM_EMAIL"),
    contactEmail: required("CONTACT_EMAIL"),
  };
}


