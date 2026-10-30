"use server";

import z from "zod";

import { sendContactNotification } from "@/lib/email/resend";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import type { ActionResult } from "@/types/action";

import { contactSchema } from "./validation";

export async function submitContactMessageAction(
  input: unknown,
): Promise<ActionResult> {
  // 1. Validate first.
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { turnstileToken, ...message } = parsed.data;

  // 2. Prove it's a person.
  const isHuman = await verifyTurnstileToken(turnstileToken);
  if (!isHuman) {
    return {
      success: false,
      error: "Verification failed. Please redo the check and try again.",
    };
  }

  // 3. Send the email.
  const sent = await sendContactNotification(message);
  if (!sent.success) {
    return {
      success: false,
      error: "We couldn't send your message. Please try again in a moment.",
    };
  }

  return { success: true };
}