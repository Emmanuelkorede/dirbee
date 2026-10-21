import { z } from "zod";

import { optionalEmailSchema } from "@/lib/validation";

// Empty string = not set. Otherwise it must be an https link on that site,
// which also blocks things like javascript: links.
function socialUrl(domain: string) {
  return z
    .string()
    .trim()
    .max(300)
    .refine((value) => {
      if (value === "") return true;
      try {
        const url = new URL(value);
        return (
          url.protocol === "https:" &&
          (url.hostname === domain || url.hostname.endsWith(`.${domain}`))
        );
      } catch {
        return false;
      }
    }, `Enter a valid https ${domain} link.`);
}

export const updateSiteSettingsSchema = z.object({
  reviewsEnabled: z.boolean(),
  showReviewsOnHomepage: z.boolean(),
  contactEmail: optionalEmailSchema,
  instagramUrl: socialUrl("instagram.com"),
  tiktokUrl: socialUrl("tiktok.com"),
});

export const toggleSchema = z.boolean();