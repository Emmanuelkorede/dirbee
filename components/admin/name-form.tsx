"use client";

import { useRouter } from "next/navigation";
import { useActionState } from "react";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ActionResult } from "@/types/action";

type NameFormProps = {
  // createArtistAction, updateArtistAction, createClientAction or updateClientAction
  action: (formData: FormData) => Promise<ActionResult<unknown>>;
  label: string; // "Artist name" or "Client name"
  listHref: string; // where to go after saving, and for Cancel
  submitLabel: string;
  id?: string; // only when editing
  defaultName?: string;
  hint?: string;
};

export function NameForm({ action, label, listHref, submitLabel, id, defaultName, hint }: NameFormProps) {
  const router = useRouter();

  const [result, formAction] = useActionState<ActionResult<unknown> | null, FormData>(
    async (_previous, formData) => {
      const response = await action(formData);
      if (response.success) router.push(listHref);
      return response;
    },
    null,
  );

  const error = result && !result.success ? result.fieldErrors?.name : undefined;

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      {id && <input type="hidden" name="id" value={id} />}

      <FormField label={label} name="name" error={error} hint={hint} required>
        <Input
          id="name"
          name="name"
          defaultValue={defaultName}
          required
          maxLength={120}
          aria-invalid={Boolean(error)}
        />
      </FormField>

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