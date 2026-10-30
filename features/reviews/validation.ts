import { z } from "zod";

import { reviewStatusEnum } from "@/db/schema";
import { optionalEmailSchema } from "@/lib/validation";

export const reviewIdSchema = z.uuid();

// Fields an admin can edit and a visitor can submit.
const reviewFields = z.object({
  clientName: z.string().trim().min(1, "Name is required.").max(120),
  email: optionalEmailSchema, // empty string = no email
  role: z.string().trim().max(120),
  company: z.string().trim().max(160),
  reviewText: z.string().trim().min(1, "Please write your review.").max(2000),
});

// Public form. Consent must be true, otherwise the review could never be approved.
export const submitReviewSchema = reviewFields.extend({
  publicationConsent: z.literal(true, {
    error: "You must agree to let us publish your review.",
  }),
  turnstileToken: z
    .string()
    .min(1, "Please complete the verification.")
    .max(2048),
});

export const updateReviewSchema = reviewFields.extend({ id: reviewIdSchema });

export const reviewFiltersSchema = z.object({
  status: z.enum(reviewStatusEnum.enumValues).optional(),
});

export const featuredReviewIdsSchema = z
  .array(reviewIdSchema)
  .max(20, "You can feature at most 20 reviews.")
  .refine((ids) => new Set(ids).size === ids.length, "A review can only be featured once.");

export type ReviewFilters = z.infer<typeof reviewFiltersSchema>;


// Admin adds a review on someone's behalf .
export const createReviewSchema = reviewFields.extend({
  publicationConsent: z.literal(true, {
    error: "Confirm that the reviewer agreed to publication.",
  }),
  featured: z.boolean(),
});