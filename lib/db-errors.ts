
export function getPgErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null) {
    if ("code" in error) return (error as { code: string }).code;
    if ("cause" in error) return getPgErrorCode((error as { cause: unknown }).cause);
  }
  return undefined;
}

// Common Postgres error codes 
export const PG_UNIQUE_VIOLATION = "23505";
export const PG_FOREIGN_KEY_VIOLATION = "23503";


//
export const NAME_ERROR = "Name must contain letters or numbers.";

export function duplicateError(label: string) {
  return `${label} with this name already exists.`;
}