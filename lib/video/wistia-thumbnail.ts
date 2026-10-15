"use cache";

import { cacheLife } from "next/cache";

import { isValidWistiaId } from "@/lib/video/wistia";

type OEmbedResponse = {
  thumbnail_url?: string;
  width?: number;
  height?: number;
};

// Wistia's oEmbed endpoint accepts iframe embed URLs.
async function fetchOEmbed(id: string): Promise<OEmbedResponse | null> {
  try {
    const embedUrl = `https://fast.wistia.net/embed/iframe/${id}`;
    const response = await fetch(
      `https://fast.wistia.net/oembed?url=${encodeURIComponent(embedUrl)}`
    );

    if (!response.ok) return null;

    return (await response.json()) as OEmbedResponse;
  } catch {
    return null;
  }
}

export async function getWistiaThumbnail(
  id: string | null | undefined
): Promise<string | null> {
  cacheLife("days");

  if (!isValidWistiaId(id)) return null;

  const data = await fetchOEmbed(id);

  if (!data?.thumbnail_url) return null;

  // Wistia returns a tiny crop by default; ask for a larger size.
  return data.thumbnail_url.replace(
    /image_crop_resized=\d+x\d+/,
    "image_crop_resized=1280x720"
  );
}

// Returns width / height (16/9 = 1.78, a phone video = 0.56).
// Falls back to 16:9 if Wistia doesn't answer.
export async function getWistiaAspectRatio(
  id: string | null | undefined
): Promise<number> {
  cacheLife("hours");

  const fallback = 16 / 9;

  if (!isValidWistiaId(id)) return fallback;

  const data = await fetchOEmbed(id);

  if (!data?.width || !data?.height) return fallback;

  const ratio = data.width / data.height;

  return ratio > 0.3 && ratio < 4 ? ratio : fallback;
}