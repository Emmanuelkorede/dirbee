"use cache";

import { cacheLife } from "next/cache";

import { isValidWistiaId } from "@/lib/video/wistia";

// Uses Wistia's oEmbed endpoint, which accepts iframe embed URLs.
// Cached for days. Returns null on any failure so callers can show a fallback.
export async function getWistiaThumbnail(
  id: string | null | undefined
): Promise<string | null> {
  cacheLife("days");

  if (!isValidWistiaId(id)) return null;

  try {
    const embedUrl = `https://fast.wistia.net/embed/iframe/${id}`;
    const response = await fetch(
      `https://fast.wistia.net/oembed?url=${encodeURIComponent(embedUrl)}`
    );

    if (!response.ok) return null;

    const data = (await response.json()) as { thumbnail_url?: string };

    if (!data.thumbnail_url) return null;

    // Wistia returns a tiny crop by default; ask for a 16:9 size.
    return data.thumbnail_url.replace(
      /image_crop_resized=\d+x\d+/,
      "image_crop_resized=1280x720"
    );
  } catch {
    return null;
  }
}