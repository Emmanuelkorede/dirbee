
const MEDIA_ID_PATTERN = /^[a-zA-Z0-9]{10}$/;

export function isValidWistiaMediaId(id: string) {
  return MEDIA_ID_PATTERN.test(id);
}

// Takes a resolved media ID and returns what the player needs.
export function getWistiaEmbed(
  mediaId: string,
  width?: number | null,
  height?: number | null,
) {
  if (!isValidWistiaMediaId(mediaId)) return null;

  return {
    iframeSrc: `https://fast.wistia.net/embed/iframe/${mediaId}`,
    aspectRatio: width && height ? width / height : 16 / 9,
  };
}