"use client";

import { useActionState, useState, type ChangeEvent } from "react";

import { FormField } from "@/components/ui/form-field";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";
import { submitContactMessageAction } from "@/features/contact/actions";
import { BUDGET_RANGES, PROJECT_TYPES } from "@/features/contact/options";
import type { ActionResult } from "@/types/action";

const empty = {
  fullName: "",
  email: "",
  artistName: "",
  company: "",
  projectType: "",
  projectDescription: "",
  budget: "",
  location: "",
  additionalMessage: "",
};

type Field = keyof typeof empty;

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [token, setToken] = useState("");
  const [attempt, setAttempt] = useState(0); // a new value makes a new Turnstile check

  // One handler for every field: <Input onChange={set("email")} />
  const set = (field: Field) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((current) => ({ ...current, [field]: event.target.value }));

  const [result, formAction] = useActionState<ActionResult<unknown> | null>(async () => {
    const response = await submitContactMessageAction({ ...values, turnstileToken: token });

    // A Turnstile token works once, so always ask for a fresh one.
    setToken("");
    setAttempt((count) => count + 1);

    return response;
  }, null);

  if (result?.success) {
    return (
      <Notice tone="success" role="status" className="space-y-1 p-6">
        <p className="font-heading text-lg uppercase tracking-tight">Message sent</p>
        <p>Thank you. We have your message and will be in touch.</p>
      </Notice>
    );
  }

  const errors = result && !result.success ? result.fieldErrors : undefined;
  const invalid = (field: Field) => Boolean(errors?.[field]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Full name" name="fullName" error={errors?.fullName} required>
          <Input id="fullName" name="fullName" value={values.fullName} maxLength={120} autoComplete="name"
            onChange={set("fullName")} aria-invalid={invalid("fullName")} />
        </FormField>
        <FormField label="Email address" name="email" error={errors?.email} required>
          <Input id="email" name="email" type="email" value={values.email} maxLength={254} autoComplete="email"
            onChange={set("email")} aria-invalid={invalid("email")} />
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Artist / stage name" name="artistName" error={errors?.artistName}>
          <Input id="artistName" name="artistName" value={values.artistName} maxLength={120} onChange={set("artistName")} />
        </FormField>
        <FormField label="Company / record label / management" name="company" error={errors?.company}>
          <Input id="company" name="company" value={values.company} maxLength={160} onChange={set("company")} />
        </FormField>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Project type" name="projectType" error={errors?.projectType} required>
          <Select id="projectType" name="projectType" value={values.projectType}
            onChange={set("projectType")} aria-invalid={invalid("projectType")}>
            <option value="">Choose a type...</option>
            {PROJECT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </Select>
        </FormField>
        <FormField label="Estimated budget" name="budget" error={errors?.budget} required>
          <Select id="budget" name="budget" value={values.budget}
            onChange={set("budget")} aria-invalid={invalid("budget")}>
            <option value="">Choose a range...</option>
            {BUDGET_RANGES.map((range) => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </Select>
        </FormField>
      </div>

      <FormField label="Project description" name="projectDescription" error={errors?.projectDescription} required>
        <Textarea id="projectDescription" name="projectDescription" rows={6} value={values.projectDescription}
          maxLength={5000} onChange={set("projectDescription")} aria-invalid={invalid("projectDescription")} />
      </FormField>

      <FormField label="Location" name="location" error={errors?.location} hint="City and country.">
        <Input id="location" name="location" value={values.location} maxLength={120} onChange={set("location")} />
      </FormField>

      <FormField label="Additional message" name="additionalMessage" error={errors?.additionalMessage}>
        <Textarea id="additionalMessage" name="additionalMessage" rows={4} value={values.additionalMessage}
          maxLength={3000} onChange={set("additionalMessage")} />
      </FormField>

      <TurnstileWidget key={attempt} onVerify={setToken} onExpire={() => setToken("")} />

      <FormMessage result={result} />

      <SubmitButton pendingText="Sending..." disabled={!token}>
        Send message
      </SubmitButton>
    </form>
  );
}