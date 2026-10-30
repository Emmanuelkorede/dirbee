"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ActionResult } from "@/types/action";

type NameFormProps = {
  action: (formData: FormData) => Promise<ActionResult<unknown>>;
  label: string; // "Name", "Client name"...
  listHref: string; // where to go after saving, and for Cancel
  submitLabel: string;
  id?: string; // only when editing
  defaultName?: string;
  hint?: string;

  // Only for Talent: shows an Artist / Starring dropdown.
  kindOptions?: { value: string; label: string }[];
  defaultKind?: string;
  kindHint?: string;
};

export function NameForm({
  action,
  label,
  listHref,
  submitLabel,
  id,
  defaultName = "",
  hint,
  kindOptions,
  defaultKind,
  kindHint,
}: NameFormProps) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [kind, setKind] = useState(defaultKind ?? kindOptions?.[0]?.value ?? "");

  const [result, formAction] = useActionState<ActionResult<unknown> | null, FormData>(
    async (_previous, formData) => {
      const response = await action(formData);
      if (response.success) router.push(listHref);
      return response;
    },
    null,
  );

  const errors = result && !result.success ? result.fieldErrors : undefined;

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      {id && <input type="hidden" name="id" value={id} />}

      <FormField label={label} name="name" error={errors?.name} hint={hint} required>
        <Input id="name" name="name" value={name} onChange={(event) => setName(event.target.value)}
          required maxLength={120} aria-invalid={Boolean(errors?.name)} />
      </FormField>

      {kindOptions && (
        <FormField label="Type" name="kind" error={errors?.kind} hint={kindHint} required>
          <Select id="kind" name="kind" value={kind} onChange={(event) => setKind(event.target.value)}
            aria-invalid={Boolean(errors?.kind)}>
            {kindOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </FormField>
      )}

      <FormMessage result={result} />

      <div className="flex items-center gap-3">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link href={listHref} className={buttonStyles({ variant: "outline" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}