import { syncWistiaMedia } from "@/lib/wistia/sync";
import { WistiaColumns } from "./types";

export const NO_WISTIA: WistiaColumns = {
  wistiaShareUrl: null,
  wistiaMediaId: null,
  wistiaThumbnailUrl: null,
  videoWidth: null,
  videoHeight: null,
  wistiaSyncedAt: null,
};

// Runs the sync and returns the columns to save.
// On failure we keep the share URL but save no media ID and no sync time.
export async function syncToColumns(shareUrl: string) {
  const result = await syncWistiaMedia(shareUrl);

  if (!result.success) {
    const columns: WistiaColumns = { ...NO_WISTIA, wistiaShareUrl: shareUrl };
    return { columns, error: result.error };
  }

  const media = result.data;
  const columns: WistiaColumns = {
    wistiaShareUrl: shareUrl,
    wistiaMediaId: media.mediaId,
    wistiaThumbnailUrl: media.thumbnailUrl,
    videoWidth: media.width,
    videoHeight: media.height,
    wistiaSyncedAt: new Date(), // only set after a successful sync
  };
  return { columns, error: undefined };
}