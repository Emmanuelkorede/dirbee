"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import { FormField } from "@/components/ui/form-field";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { updateReviewAction } from "@/features/reviews/actions";
import type { ActionResult } from "@/types/action";
import type { Review } from "@/types/database";

export function ReviewEditForm({ review, onDone }: { review: Review; onDone: () => void }) {
  const router = useRouter();
  const [clientName, setClientName] = useState(review.clientName);
  const [email, setEmail] = useState(review.email ?? "");
  const [role, setRole] = useState(review.role ?? "");
  const [company, setCompany] = useState(review.company ?? "");
  const [reviewText, setReviewText] = useState(review.reviewText);

  const [result, formAction] = useActionState<ActionResult<unknown> | null>(async () => {
    const response = await updateReviewAction({
      id: review.id,
      clientName,
      email,
      role,
      company,
      reviewText,
    });

    if (response.success) {
      router.refresh();
      onDone();
    }
    return response;
  }, null);

  const errors = result && !result.success ? result.fieldErrors : undefined;

  return (
    <form action={formAction} className="space-y-5">
      <FormField label="Name" name="clientName" error={errors?.clientName} required>
        <Input id="clientName" name="clientName" value={clientName} maxLength={120}
          onChange={(event) => setClientName(event.target.value)} aria-invalid={Boolean(errors?.clientName)} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Role" name="role" error={errors?.role}>
          <Input id="role" name="role" value={role} maxLength={120} onChange={(event) => setRole(event.target.value)} />
        </FormField>
        <FormField label="Company" name="company" error={errors?.company}>
          <Input id="company" name="company" value={company} maxLength={160} onChange={(event) => setCompany(event.target.value)} />
        </FormField>
      </div>

      <FormField label="Email" name="email" error={errors?.email} hint="Private. Never shown on the site.">
        <Input id="email" name="email" type="email" value={email} maxLength={254}
          onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors?.email)} />
      </FormField>

      <FormField label="Review" name="reviewText" error={errors?.reviewText} required>
        <Textarea id="reviewText" name="reviewText" rows={6} value={reviewText} maxLength={2000}
          onChange={(event) => setReviewText(event.target.value)} aria-invalid={Boolean(errors?.reviewText)} />
      </FormField>

      <FormMessage result={result} />

      <SubmitButton>Save changes</SubmitButton>
    </form>
  );
}