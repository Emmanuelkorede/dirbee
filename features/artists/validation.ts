import { z } from "zod";

export const artistIdSchema = z.uuid();

export const artistInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name must be 120 characters or fewer."),
});

export const updateArtistSchema = artistInputSchema.extend({
  id: artistIdSchema,
});

// Applied to the generated slug, never to user input directly.
export const slugSchema = z
  .string()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export type ArtistInput = z.infer<typeof artistInputSchema>;
export type UpdateArtistInput = z.infer<typeof updateArtistSchema>;