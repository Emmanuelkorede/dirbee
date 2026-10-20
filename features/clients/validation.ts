import { z } from "zod";

export const clientIdSchema = z.uuid();

export const clientInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
});

export const updateClientSchema = clientInputSchema.extend({
  id: clientIdSchema,
});

// Used on the generated slug, never on user input.
export const slugSchema = z
  .string()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);