import { z } from "zod";

import { personKindEnum } from "@/db/schema";

export const artistIdSchema = z.uuid();

export const artistInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  kind: z.enum(personKindEnum.enumValues, { error: "Choose Artist or Starring." }),
});

export const updateArtistSchema = artistInputSchema.extend({
  id: artistIdSchema,
});

export type ArtistInput = z.infer<typeof artistInputSchema>;
export type UpdateArtistInput = z.infer<typeof updateArtistSchema>;