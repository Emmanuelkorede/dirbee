// Wistia media hashed IDs are 10 lowercase letters/digits.
// Share-link slugs (/s/...) are a different, longer identifier.
const WISTIA_ID_PATTERN = /^[a-z0-9]{10}$/i;

export function isValidWistiaId(
  id: string | null | undefined
): id is string {
  return typeof id === "string" && WISTIA_ID_PATTERN.test(id);
}

export function getWistiaEmbedUrl(
  id: string,
  options: { autoPlay?: boolean } = {}
): string {
  const params = new URLSearchParams({ videoFoam: "true" });

  if (options.autoPlay) params.set("autoPlay", "true");

  return `https://fast.wistia.net/embed/iframe/${id}?${params.toString()}`;
}