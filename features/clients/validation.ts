import { z } from "zod";

export const clientIdSchema = z.uuid();

export const clientInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
});

export const updateClientSchema = clientInputSchema.extend({
  id: clientIdSchema,
});
