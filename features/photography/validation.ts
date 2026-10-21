
import { z } from "zod";

export const photoShootIdSchema = z.uuid();
export const photoIdSchema = z.uuid();

const altText = z.string().trim().min(1, "Alt text is required.").max(300);
const caption = z.string().trim().max(500); // empty string = no caption

export const photoShootInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(150),
  description: z.string().trim().max(2000), // empty string = no description
});

export const updatePhotoShootSchema = photoShootInputSchema.extend({
  id: photoShootIdSchema,
});

export const addPhotoSchema = z.object({
  shootId: photoShootIdSchema,
  cloudinaryPublicId: z.string().trim().min(1).max(200),
  altText,
  caption,
});

export const updatePhotoSchema = z.object({
  id: photoIdSchema,
  altText,
  caption,
});

// The array position becomes the display order.
export const reorderPhotosSchema = z.object({
  shootId: photoShootIdSchema,
  photoIds: z
    .array(photoIdSchema)
    .min(1)
    .max(500)
    .refine((ids) => new Set(ids).size === ids.length, "Each photo can only appear once."),
});