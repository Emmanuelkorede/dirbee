"use client";

import { useActionState, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";
import { submitReviewAction } from "@/features/reviews/actions";
import type { ActionResult } from "@/types/action";

export function ReviewSubmissionForm() {
  const [clientName, setClientName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [consent, setConsent] = useState(false);

  const [token, setToken] = useState("");
  const [attempt, setAttempt] = useState(0); // a new value makes a new Turnstile check

  const [result, formAction] = useActionState<ActionResult<unknown> | null>(async () => {
    const response = await submitReviewAction({
      clientName,
      role,
      company,
      email,
      reviewText,
      publicationConsent: consent,
      turnstileToken: token,
    });

    // A Turnstile token works once, so always ask for a fresh one.
    setToken("");
    setAttempt((count) => count + 1);

    return response;
  }, null);

  if (result?.success) {
    return (
      <Notice tone="success" role="status" className="space-y-1 p-6">
        <p className="font-heading text-lg uppercase tracking-tight">Thank you</p>
        <p>Your review has been sent. It will appear on the site once it has been approved.</p>
      </Notice>
    );
  }

  const errors = result && !result.success ? result.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-6">
      <FormField label="Your name" name="clientName" error={errors?.clientName} required>
        <Input id="clientName" name="clientName" value={clientName} maxLength={120} autoComplete="name"
          onChange={(event) => setClientName(event.target.value)} aria-invalid={Boolean(errors?.clientName)} />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Role" name="role" error={errors?.role} hint="Optional.">
          <Input id="role" name="role" value={role} maxLength={120} onChange={(event) => setRole(event.target.value)} />
        </FormField>
        <FormField label="Company" name="company" error={errors?.company} hint="Optional.">
          <Input id="company" name="company" value={company} maxLength={160} onChange={(event) => setCompany(event.target.value)} />
        </FormField>
      </div>

      <FormField label="Email" name="email" error={errors?.email} hint="Optional. Private, never shown on the site.">
        <Input id="email" name="email" type="email" value={email} maxLength={254} autoComplete="email"
          onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors?.email)} />
      </FormField>

      <FormField label="Your review" name="reviewText" error={errors?.reviewText} required>
        <Textarea id="reviewText" name="reviewText" rows={6} value={reviewText} maxLength={2000}
          onChange={(event) => setReviewText(event.target.value)} aria-invalid={Boolean(errors?.reviewText)} />
      </FormField>

      <div className="space-y-2">
        <Checkbox
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          label="House of Bee may publish this review on its website."
        />
        {errors?.publicationConsent && (
          <p role="alert" className="text-xs text-danger">{errors.publicationConsent[0]}</p>
        )}
      </div>

      <TurnstileWidget key={attempt} onVerify={setToken} onExpire={() => setToken("")} />

      <FormMessage result={result} />

      <SubmitButton pendingText="Sending..." disabled={!token || !consent}>
        Send review
      </SubmitButton>
    </form>
  );
}