
import { z } from "zod";

import { isValidWistiaMediaId } from "./embed";
import { getWistiaEnv } from "../env";

import { Result } from "@/types/action";

const OEMBED_URL = "https://fast.wistia.com/oembed";
const DATA_API_URL = "https://api.wistia.com/v1";

export type WistiaMetadata = {
  mediaId: string;
  title: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
};


function fail(error: string): { success: false; error: string } {
  return { success: false, error };
}

//  Validate the URL

type ParsedUrl = {
  type: "share" | "media"; // /s/<slug> or /medias/<id>
  id: string;
  cleanUrl: string; // origin + path only, so no extra query params travel with it
};

function parseWistiaUrl(input: string): ParsedUrl | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  const hostOk = host === "wistia.com" || host.endsWith(".wistia.com");
  if (url.protocol !== "https:" || !hostOk) return null;
  if (url.port || url.username || url.password) return null;

  const cleanUrl = `${url.origin}${url.pathname}`;

  const share = url.pathname.match(/^\/s\/([a-zA-Z0-9]{4,40})\/?$/);
  if (share) return { type: "share", id: share[1], cleanUrl };

  const media = url.pathname.match(
  /^\/medias\/([a-zA-Z0-9]{10})(?:\/manage)?\/?$/,
  );

  if (media) return { type: "media", id: media[1], cleanUrl };

  return null;
}

export function validateWistiaShareUrl(url: string) {
  return parseWistiaUrl(url) !== null;
}

// Returns the /s/<slug> part. This is NOT the media ID.
export function extractShareLinkIdentifier(url: string) {
  const parsed = parseWistiaUrl(url);
  return parsed?.type === "share" ? parsed.id : null;
}

// Share link -> real media ID 
const oembedSchema = z.object({ html: z.string() });

export async function resolveWistiaShareLink(
  url: string,
): Promise<Result<string>> {
  const parsed = parseWistiaUrl(url);
  if (!parsed) return fail("This is not a valid Wistia link.");

  // Old-style /medias/<id> links already contain the real ID.
  if (parsed.type === "media") return { success: true, data: parsed.id };

  try {
    // The host is fixed, so users can't make us fetch arbitrary URLs.
    const res = await fetch(
      `${OEMBED_URL}?url=${encodeURIComponent(parsed.cleanUrl)}`,
      { cache: "no-store", signal: AbortSignal.timeout(10_000) },
    );
    const text = await res.text();

    const notFound =
      "Wistia could not find this share link. Make sure it is set to Unlocked.";
    if (!res.ok || !text) return fail(notFound);

    const body = oembedSchema.safeParse(JSON.parse(text));
    if (!body.success) return fail(notFound);

    // The ID sits inside the embed html, e.g. .../embed/iframe/<id>
    const match =
      body.data.html.match(/embed\/iframe\/([a-zA-Z0-9]{10})\b/) ??
      body.data.html.match(/wistia_async_([a-zA-Z0-9]{10})\b/);

    if (!match) return fail("Could not read the video ID from Wistia.");
    return { success: true, data: match[1] };
  } catch (error) {
    console.error("resolveWistiaShareLink failed:", error);
    return fail("Could not reach Wistia. Try again.");
  }
}

//  Media ID -> metadata 
const mediaSchema = z.object({
  hashed_id: z.string(),
  name: z.string(),
  type: z.string().optional(),
  status: z.string().optional(),
  thumbnail: z.object({ url: z.string() }).nullish(),
  assets: z
    .array(
      z.object({
        width: z.number().nullish(),
        height: z.number().nullish(),
        contentType: z.string().nullish(),
      }),
    )
    .optional(),
});

export async function getWistiaMediaMetadata(
  mediaId: string,
): Promise<Result<WistiaMetadata>> {
  // Checked before it goes into a URL path.
  if (!isValidWistiaMediaId(mediaId)) return fail("Invalid Wistia media ID.");

    let token: string;
  try {
    token = getWistiaEnv().apiToken;
  } catch {
    return fail("WISTIA_API_TOKEN is not set.");
  }

  try {
    const res = await fetch(`${DATA_API_URL}/medias/${mediaId}.json`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (res.status === 401 || res.status === 403) {
      return fail("Wistia rejected the API token. Check its permissions.");
    }
    if (res.status === 404) {
      return fail("This video was not found in your Wistia account.");
    }
    if (!res.ok) return fail(`Wistia returned an error (${res.status}).`);

    const parsed = mediaSchema.safeParse(await res.json());
    if (!parsed.success || parsed.data.hashed_id !== mediaId) {
      return fail("Wistia returned unexpected data.");
    }
    const media = parsed.data;

    if (media.type && media.type.toLowerCase() !== "video") {
      return fail("This Wistia media is not a video.");
    }
    if (media.status && media.status !== "ready") {
      return fail("This video is still processing in Wistia. Try again soon.");
    }

    // Biggest video file gives the real dimensions.
    const biggest = (media.assets ?? [])
      .filter((a) => a.contentType?.startsWith("video/") && a.width && a.height)
      .sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];

    // Wistia adds ?image_crop_resized=WxH to thumbnails; we store the plain URL.
    const rawThumb = media.thumbnail?.url.replace(/^http:/, "https:");
    const thumbnailUrl = rawThumb?.startsWith("https://")
      ? rawThumb.split("?")[0]
      : null;

    return {
      success: true,
      data: {
        mediaId,
        title: media.name,
        thumbnailUrl,
        width: biggest?.width ?? null,
        height: biggest?.height ?? null,
      },
    };
  } catch (error) {
    console.error("getWistiaMediaMetadata failed:", error);
    return fail("Could not reach Wistia. Try again.");
  }
}

//  Both steps together 
export async function syncWistiaMedia(
  url: string,
): Promise<Result<WistiaMetadata>> {
  const resolved = await resolveWistiaShareLink(url);
  if (!resolved.success) return resolved;

  return getWistiaMediaMetadata(resolved.data);
}