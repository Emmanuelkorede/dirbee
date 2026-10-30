"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createReviewAction, updateReviewAction } from "@/features/reviews/actions";
import type { ActionResult } from "@/types/action";
import type { Review } from "@/types/database";

export function ReviewForm({ review }: { review?: Review }) {
  const router = useRouter();
  const [clientName, setClientName] = useState(review?.clientName ?? "");
  const [email, setEmail] = useState(review?.email ?? "");
  const [role, setRole] = useState(review?.role ?? "");
  const [company, setCompany] = useState(review?.company ?? "");
  const [reviewText, setReviewText] = useState(review?.reviewText ?? "");
  const [consent, setConsent] = useState(false); // adding only
  const [featured, setFeatured] = useState(false); // adding only

  // Back to the list tab where this review lives. A new review is approved.
  const listHref = `/admin/reviews?status=${review?.status ?? "approved"}`;

  const [result, formAction] = useActionState<ActionResult<unknown> | null>(async () => {
    const fields = { clientName, email, role, company, reviewText };

    const response = review
      ? await updateReviewAction({ id: review.id, ...fields })
      : await createReviewAction({ ...fields, publicationConsent: consent, featured });

    if (response.success) router.push(listHref);
    return response;
  }, null);

  const errors = result && !result.success ? result.fieldErrors : undefined;

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <FormField label="Name" name="clientName" error={errors?.clientName} required>
        <Input id="clientName" name="clientName" value={clientName} maxLength={120}
          onChange={(event) => setClientName(event.target.value)} aria-invalid={Boolean(errors?.clientName)} />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
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

      {!review && (
        <div className="space-y-4 rounded-xl border border-border p-4">
          <div className="space-y-2">
            <Checkbox
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              label="The reviewer agreed to have this review published"
              description="Required. The review goes live straight away, without waiting for approval."
            />
            {errors?.publicationConsent && (
              <p role="alert" className="text-xs text-danger">{errors.publicationConsent[0]}</p>
            )}
          </div>

          <Checkbox
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
            label="Feature on the homepage"
            description="Needs reviews and homepage reviews switched on in Settings."
          />
        </div>
      )}

      <FormMessage result={result} />

      <div className="flex items-center gap-3">
        <SubmitButton>{review ? "Save changes" : "Add review"}</SubmitButton>
        <Link href={listHref} className={buttonStyles({ variant: "outline" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}