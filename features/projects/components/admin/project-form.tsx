"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { ArtistPicker } from "@/features/artists/components/artist-picker";
import { ClientSelect } from "@/features/clients/components/client-select";
import { createProjectAction, updateProjectAction } from "@/features/projects/actions";
import { PROJECT_TYPE_OPTIONS } from "@/features/projects/options";
import type { ProjectDetail } from "@/features/projects/types";
import type { ActionResult } from "@/types/action";
import type { Artist, Client } from "@/types/database";
import { CreditsEditor } from "./credits-editor";

type ProjectFormProps = {
  artists: Artist[];
  clients: Client[];
  project?: ProjectDetail; // present = editing
};

type SaveResult = ActionResult<{ id: string; syncWarning?: string }>;

export function ProjectForm({ artists, clients, project }: ProjectFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [projectType, setProjectType] = useState<string>(project?.projectType ?? PROJECT_TYPE_OPTIONS[0].value);
  const [projectYear, setProjectYear] = useState(String(project?.projectYear ?? new Date().getFullYear()));
  const [clientId, setClientId] = useState<string | null>(project?.clientId ?? null);
  const [artistIds, setArtistIds] = useState<string[]>(project?.artists.map((artist) => artist.id) ?? []);
  const [credits, setCredits] = useState(project?.credits ?? []);
  const [wistiaShareUrl, setWistiaShareUrl] = useState(project?.wistiaShareUrl ?? "");

  const [result, formAction] = useActionState<SaveResult | null>(
    async () => {
      const input = {
        title,
        description,
        projectType,
        projectYear,
        clientId,
        artistIds,
        // Empty rows are dropped instead of failing validation.
        credits: credits.filter((credit) => credit.label.trim() || credit.value.trim()),
        wistiaShareUrl,
      };

      const response = project
        ? await updateProjectAction({ id: project.id, ...input })
        : await createProjectAction(input);

      if (response.success) {
        const id = response.data?.id;
        const warning = response.data?.syncWarning;

        if (project) {
          router.refresh(); // refresh the sync status and badges
        } else if (id) {
          const query = warning ? `?syncWarning=${encodeURIComponent(warning)}` : "?created=1";
          router.push(`/admin/projects/${id}/edit${query}`);
        }
      }

      return response;
    },
    null,
  );

  const errors = result && !result.success ? result.fieldErrors : undefined;
  const syncWarning = result?.success ? result.data?.syncWarning : undefined;

  return (
    <form action={formAction} className="max-w-3xl space-y-8">
      <FormField label="Title" name="title" error={errors?.title} required>
        <Input id="title" name="title" value={title} maxLength={150}
          onChange={(event) => setTitle(event.target.value)} aria-invalid={Boolean(errors?.title)} />
      </FormField>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Project type" name="projectType" error={errors?.projectType} required>
          <Select id="projectType" name="projectType" value={projectType}
            onChange={(event) => setProjectType(event.target.value)}>
            {PROJECT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </FormField>

        <FormField label="Year" name="projectYear" error={errors?.projectYear} required>
          <Input id="projectYear" name="projectYear" type="number" min={1900} max={2200} value={projectYear}
            onChange={(event) => setProjectYear(event.target.value)} aria-invalid={Boolean(errors?.projectYear)} />
        </FormField>
      </div>

      <FormField label="Description" name="description" error={errors?.description} required>
        <Textarea id="description" name="description" rows={6} value={description} maxLength={5000}
          onChange={(event) => setDescription(event.target.value)} aria-invalid={Boolean(errors?.description)} />
      </FormField>

      <FormField label="Artists" name="artistIds" error={errors?.artistIds}
        hint="Order matters: this is the order shown on the project page." required>
        <ArtistPicker id="artistIds" artists={artists} value={artistIds} onChange={setArtistIds} />
      </FormField>

      <FormField label="Client" name="clientId" error={errors?.clientId} hint="Optional.">
        <ClientSelect id="clientId" clients={clients} value={clientId} onChange={setClientId} />
      </FormField>

      <FormField label="Credits" name="credits" error={errors?.credits}
        hint="Optional. For example Director, Editor, Colorist.">
        <CreditsEditor value={credits} onChange={setCredits} />
      </FormField>

      <FormField label="Wistia share link" name="wistiaShareUrl" error={errors?.wistiaShareUrl}
        hint="Paste the unlocked share link. The video is checked with Wistia when you save.">
        <Input id="wistiaShareUrl" name="wistiaShareUrl" inputMode="url" value={wistiaShareUrl}
          placeholder="https://yourname.wistia.com/s/..." maxLength={500}
          onChange={(event) => setWistiaShareUrl(event.target.value)} aria-invalid={Boolean(errors?.wistiaShareUrl)} />
      </FormField>

      <FormMessage result={result} successText="Saved." />
      {syncWarning && (
        <Notice tone="warning">Saved, but the Wistia sync failed: {syncWarning}</Notice>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton>{project ? "Save changes" : "Create project"}</SubmitButton>
        <Link href="/admin/projects" className={buttonStyles({ variant: "outline" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}