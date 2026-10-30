import { z } from "zod";

import { getCloudinaryEnv } from "@/lib/env";
import type { Result } from "@/types/action";
import { cloudinary } from "./client";

// Every photo lives under this path: house-of-bee/photography/<random id>
export const UPLOAD_FOLDER = "house-of-bee/photography";
const PUBLIC_ID_PATTERN = /^house-of-bee\/photography\/[a-zA-Z0-9_-]{8,64}$/;
const ALLOWED_FORMATS = "jpg,jpeg,png,webp";

function fail(error: string): { success: false; error: string } {
  return { success: false, error };
}

//  1. Upload signature 

// The browser must send EVERY field returned here, plus the file.
// Changing any signed value makes Cloudinary reject the upload.
export function createUploadSignature() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryEnv();

  const paramsToSign = {
    allowed_formats: ALLOWED_FORMATS,
    public_id: `${UPLOAD_FOLDER}/${crypto.randomUUID()}`, // chosen by us, not the browser
    timestamp: Math.round(Date.now() / 1000),
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    fields: { ...paramsToSign, api_key: apiKey, signature },
  };
}

//  2. Check an upload really exists 

export function isValidUploadPublicId(publicId: string) {
  return PUBLIC_ID_PATTERN.test(publicId);
}

const resourceSchema = z.object({
  secure_url: z.string(),
  width: z.number(),
  height: z.number(),
  bytes: z.number(),
  format: z.string(),
});

// Same names as the photos table columns, so it can be spread into an insert.
export type UploadedImage = {
  imageUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  mimeType: string;
};

// Asks Cloudinary about the asset instead of trusting what the browser says.
export async function getUploadedImage(
  publicId: string,
): Promise<Result<UploadedImage>> {
  if (!isValidUploadPublicId(publicId)) return fail("Invalid image ID.");

  try {
    const resource = await cloudinary.api.resource(publicId, {
      resource_type: "image",
      type: "upload",
    });

    const parsed = resourceSchema.safeParse(resource);
    if (!parsed.success || !parsed.data.secure_url.startsWith("https://")) {
      return fail("Cloudinary returned unexpected data for this image.");
    }

    const { secure_url, width, height, bytes, format } = parsed.data;
    return {
      success: true,
      data: {
        imageUrl: secure_url,
        width,
        height,
        sizeBytes: bytes,
        mimeType: format === "jpg" ? "image/jpeg" : `image/${format}`,
      },
    };
  } catch (error) {
    console.error("getUploadedImage failed:", error);
    return fail("Could not confirm the upload in Cloudinary. Try uploading again.");
  }
}

//  3. Delete 

// "absent" counts as success: the goal (asset is gone) is already true.
export async function deleteCloudinaryAsset(
  publicId: string,
): Promise<Result<"deleted" | "absent">> {
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      type: "upload",
      invalidate: true, // also clear Cloudinary's CDN cache
    });

    if (response.result === "ok") return { success: true, data: "deleted" };
    if (response.result === "not found") return { success: true, data: "absent" };

    return fail(`Cloudinary replied "${response.result}".`);
  } catch (error) {
    console.error("deleteCloudinaryAsset failed:", publicId, error);
    return fail("Could not reach Cloudinary.");
  }
}