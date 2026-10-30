"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateSiteSettingsAction } from "@/features/settings/actions";
import type { ActionResult } from "@/types/action";
import type { SiteSettings } from "@/types/database";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [reviewsEnabled, setReviewsEnabled] = useState(settings.reviewsEnabled);
  const [showReviewsOnHomepage, setShowReviewsOnHomepage] = useState(settings.showReviewsOnHomepage);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail ?? "");
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl ?? "");
  const [tiktokUrl, setTiktokUrl] = useState(settings.tiktokUrl ?? "");

  const [result, formAction] = useActionState<ActionResult<unknown> | null>(async () => {
    const response = await updateSiteSettingsAction({
      reviewsEnabled,
      showReviewsOnHomepage,
      contactEmail,
      instagramUrl,
      tiktokUrl,
    });
    if (response.success) router.refresh();
    return response;
  }, null);

  const errors = result && !result.success ? result.fieldErrors : undefined;

  return (
    <form action={formAction} className="max-w-2xl space-y-10">
      <fieldset className="space-y-4">
        <legend className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Reviews</legend>

        <Checkbox
          checked={reviewsEnabled}
          onChange={(event) => setReviewsEnabled(event.target.checked)}
          label="Show approved reviews on the Reviews page"
          description="Visitors can still send reviews while this is off. They stay private until you approve them."
        />
        <Checkbox
          checked={showReviewsOnHomepage}
          onChange={(event) => setShowReviewsOnHomepage(event.target.checked)}
          label="Show featured reviews on the homepage"
          description="Also needs the switch above to be on."
        />
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Footer links</legend>

        <FormField label="Contact email" name="contactEmail" error={errors?.contactEmail}
          hint="Shown in the footer. Contact form messages go to the CONTACT_EMAIL setting on your host, so keep both the same.">
          <Input id="contactEmail" name="contactEmail" type="email" value={contactEmail} maxLength={254}
            onChange={(event) => setContactEmail(event.target.value)} aria-invalid={Boolean(errors?.contactEmail)} />
        </FormField>

        <FormField label="Instagram link" name="instagramUrl" error={errors?.instagramUrl}
          hint="Leave empty to hide the link.">
          <Input id="instagramUrl" name="instagramUrl" inputMode="url" value={instagramUrl} maxLength={300}
            placeholder="https://www.instagram.com/..." onChange={(event) => setInstagramUrl(event.target.value)}
            aria-invalid={Boolean(errors?.instagramUrl)} />
        </FormField>

        <FormField label="TikTok link" name="tiktokUrl" error={errors?.tiktokUrl}
          hint="Leave empty to hide the link.">
          <Input id="tiktokUrl" name="tiktokUrl" inputMode="url" value={tiktokUrl} maxLength={300}
            placeholder="https://www.tiktok.com/@..." onChange={(event) => setTiktokUrl(event.target.value)}
            aria-invalid={Boolean(errors?.tiktokUrl)} />
        </FormField>
      </fieldset>

      <FormMessage result={result} successText="Settings saved. The site updates on the next visit." />

      <SubmitButton>Save settings</SubmitButton>
    </form>
  );
}