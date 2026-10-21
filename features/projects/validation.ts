import { z } from "zod";

import { projectTypeEnum } from "@/db/schema";
import { validateWistiaShareUrl } from "@/lib/wistia/sync";

export const projectIdSchema = z.uuid();

const creditSchema = z.object({
  label: z.string().trim().min(1, "Credit label is required.").max(60),
  value: z.string().trim().min(1, "Credit value is required.").max(120),
});

const uniqueIds = (ids: string[]) => new Set(ids).size === ids.length;

export const projectInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(150),
  description: z.string().trim().min(1, "Description is required.").max(5000),
  projectType: z.enum(projectTypeEnum.enumValues),
  projectYear: z.coerce.number().int().min(1900).max(2200),

  clientId: z.uuid().nullable(),

  artistIds: z
    .array(z.uuid())
    .min(1, "Choose at least one artist.")
    .max(10)
    .refine(uniqueIds, "Each artist can only be added once."),

  credits: z.array(creditSchema).max(20),

  wistiaShareUrl: z
    .string()
    .trim()
    .max(500)
    .refine(
      (url) => url === "" || validateWistiaShareUrl(url),
      "Enter a valid https Wistia share link.",
    ),
});

export const updateProjectSchema = projectInputSchema.extend({
  id: projectIdSchema,
});

// Homepage order 
export const featuredIdsSchema = z
  .array(projectIdSchema)
  .max(10, "You can feature at most 10 projects.")
  .refine(uniqueIds, "A project can only be featured once.");