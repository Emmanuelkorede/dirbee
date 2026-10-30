import { z } from "zod";

import { BUDGET_RANGES, isOneOf, PROJECT_TYPES } from "./options";

// Blocks line breaks so nobody can sneak extra lines into the email subject.
const ONE_LINE = /^[^\r\n]*$/;
const ONE_LINE_MESSAGE = "Line breaks are not allowed here.";

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required.")
    .max(120)
    .regex(ONE_LINE, ONE_LINE_MESSAGE),

  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.email("Enter a valid email address.")),

  artistName: z.string().trim().max(120).regex(ONE_LINE, ONE_LINE_MESSAGE),
  company: z.string().trim().max(160).regex(ONE_LINE, ONE_LINE_MESSAGE),

  projectType: z
    .string()
    .refine((value) => isOneOf(PROJECT_TYPES, value), "Choose a project type."),

  projectDescription: z
    .string()
    .trim()
    .min(1, "Please describe your project.")
    .max(5000),

  budget: z
    .string()
    .refine((value) => isOneOf(BUDGET_RANGES, value), "Choose a budget range."),

  location: z.string().trim().max(120).regex(ONE_LINE, ONE_LINE_MESSAGE),
  additionalMessage: z.string().trim().max(3000),

  // From the Turnstile widget (the browser field is named cf-turnstile-response).
  turnstileToken: z
    .string()
    .min(1, "Please complete the verification.")
    .max(2048),
});

export type ContactInput = z.infer<typeof contactSchema>;

// What gets emailed: the form without the token.
export type ContactMessage = Omit<ContactInput, "turnstileToken">;