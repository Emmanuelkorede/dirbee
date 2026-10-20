
export function getPgErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    return (error as { code: string }).code;
  }
  return undefined;
}

// Common Postgres error codes 
export const PG_UNIQUE_VIOLATION = "23505";
export const PG_FOREIGN_KEY_VIOLATION = "23503";