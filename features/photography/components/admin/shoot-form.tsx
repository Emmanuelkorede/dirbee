"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { createPhotoShootAction, updatePhotoShootAction } from "@/features/photography/actions";
import type { ActionResult } from "@/types/action";
import type { PhotoShoot } from "@/types/database";

export function ShootForm({ shoot }: { shoot?: PhotoShoot }) {
  const router = useRouter();
  const [title, setTitle] = useState(shoot?.title ?? "");
  const [description, setDescription] = useState(shoot?.description ?? "");

  const [result, formAction] = useActionState<ActionResult<unknown> | null>(async () => {
    const input = { title, description };

    if (shoot) {
      const response = await updatePhotoShootAction({ id: shoot.id, ...input });
      if (response.success) router.refresh();
      return response;
    }

    const response = await createPhotoShootAction(input);
    if (response.success && response.data) {
      // Go straight to the edit page so photos can be added.
      router.push(`/admin/photography/${response.data.id}/edit?created=1`);
    }
    return response;
  }, null);

  const errors = result && !result.success ? result.fieldErrors : undefined;

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <FormField label="Title" name="title" error={errors?.title} required
        hint="Renaming also changes the shoot's URL slug.">
        <Input id="title" name="title" value={title} maxLength={150}
          onChange={(event) => setTitle(event.target.value)} aria-invalid={Boolean(errors?.title)} />
      </FormField>

      <FormField label="Description" name="description" error={errors?.description} hint="Optional.">
        <Textarea id="description" name="description" rows={4} value={description} maxLength={2000}
          onChange={(event) => setDescription(event.target.value)} aria-invalid={Boolean(errors?.description)} />
      </FormField>

      <FormMessage result={result} successText="Saved." />

      <div className="flex items-center gap-3">
        <SubmitButton>{shoot ? "Save changes" : "Create shoot"}</SubmitButton>
        <Link href="/admin/photography" className={buttonStyles({ variant: "outline" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}