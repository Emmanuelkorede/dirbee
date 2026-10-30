import { Resend } from "resend";

import {
  BUDGET_RANGES,
  getLabel,
  PROJECT_TYPES,
} from "@/features/contact/options";
import type { ContactMessage } from "@/features/contact/validation";
import { getResendEnv } from "@/lib/env";

const { apiKey, fromEmail, contactEmail } = getResendEnv();
const resend = new Resend(apiKey);

type SendResult = { success: true } | { success: false; error: string };

// Empty optional fields show as a dash in the email.
function orDash(value: string) {
  return value || "—";
}

// Emails the contact form to House of Bee.
export async function sendContactNotification(
  input: ContactMessage,
): Promise<SendResult> {
  const projectType = getLabel(PROJECT_TYPES, input.projectType);
  const budget = getLabel(BUDGET_RANGES, input.budget);

  const text = [
    `Full name: ${input.fullName}`,
    `Email: ${input.email}`,
    `Artist / stage name: ${orDash(input.artistName)}`,
    `Company / label / management: ${orDash(input.company)}`,
    `Project type: ${projectType}`,
    `Estimated budget: ${budget}`,
    `Location: ${orDash(input.location)}`,
    "",
    "Project description:",
    input.projectDescription,
    "",
    "Additional message:",
    orDash(input.additionalMessage),
  ].join("\n");

  try {
    // Resend returns { data, error } instead of throwing.
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [contactEmail],
      replyTo: input.email,
      subject: `New enquiry from ${input.fullName} (${projectType})`,
      text,
    });

    if (error) {
      console.error("Resend rejected the email:", error);
      return { success: false, error: "The email service rejected the message." };
    }

    return { success: true };
  } catch (error) {
    console.error("sendContactNotification failed:", error);
    return { success: false, error: "Could not reach the email service." };
  }
}