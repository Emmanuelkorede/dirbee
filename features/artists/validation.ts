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


export type ArtistInput = z.infer<typeof artistInputSchema>;
export type UpdateArtistInput = z.infer<typeof updateArtistSchema>;