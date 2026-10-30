"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fieldStyles, Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { addPhotoRecordAction } from "@/features/photography/actions";
import cn from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_MB = 10;

type Item = {
  id: string;
  file: File;
  altText: string;
  caption: string;
  status: "waiting" | "uploading" | "done" | "error";
  error?: string;
  publicId?: string; 

}

const statusLabel = { waiting: "Ready", uploading: "Uploading", done: "Added", error: "Failed" } as const;
const statusTone = { waiting: "neutral", uploading: "warning", done: "success", error: "danger" } as const;

type SignResponse = { uploadUrl: string; fields: Record<string, string | number> };

// Returns the public ID Cloudinary stored the file under.
async function uploadToCloudinary(file: File): Promise<string> {
  const signResponse = await fetch("/api/uploads/sign", { method: "POST" });

  let sign: SignResponse;
  try {
    sign = (await signResponse.json()) as SignResponse;
  } catch {
    // A signed-out request gets redirected to an HTML page, which is not JSON.
    throw new Error("Could not get upload permission. Try signing in again.");
  }
  if (!signResponse.ok) throw new Error("Could not get upload permission.");

  const body = new FormData();
  for (const [key, value] of Object.entries(sign.fields)) body.append(key, String(value));
  body.append("file", file);

  const response = await fetch(sign.uploadUrl, { method: "POST", body });
  const data = await response.json();

  if (!response.ok) throw new Error(data?.error?.message ?? "Cloudinary rejected the upload.");
  return data.public_id as string;
}

export function PhotoUploader({ shootId, shootTitle }: { shootId: string; shootTitle: string }) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const patch = (id: string, changes: Partial<Item>) =>
    setItems((previous) => previous.map((item) => (item.id === id ? { ...item, ...changes } : item)));

  function addFiles(files: FileList | null) {
    if (!files) return;

    const rejected: string[] = [];
    const accepted: Item[] = [];

    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        rejected.push(`${file.name}: only JPG, PNG or WebP files are allowed.`);
      } else if (file.size > MAX_MB * 1024 * 1024) {
        rejected.push(`${file.name}: larger than ${MAX_MB} MB.`);
      } else {
        accepted.push({
          id: crypto.randomUUID(),
          file,
          altText: shootTitle, // editable. Alt text is required by the database.
          caption: "",
          status: "waiting",
        });
      }
    }

    setProblems(rejected);
    setMessage("");
    setItems((previous) => [...previous, ...accepted]);
  }

  async function uploadAll() {
    setBusy(true);
    setMessage("");
    let added = 0;

    for (const item of items) {
      patch(item.id, { status: "uploading", error: undefined });

      try {
        const publicId = item.publicId ?? (await uploadToCloudinary(item.file));
        patch(item.id, { publicId });

        const saved = await addPhotoRecordAction({
          shootId,
          cloudinaryPublicId: publicId,
          altText: item.altText,
          caption: item.caption,
        });

        if (!saved.success) {
          patch(item.id, { status: "error", error: saved.error });
          continue;
        }

        patch(item.id, { status: "done" });
        added += 1;
      } catch (error) {
        patch(item.id, {
          status: "error",
          error: error instanceof Error ? error.message : "Upload failed.",
        });
      }
    }

    // Finished photos now live in the manager below, so drop them from this list.
    setItems((previous) => previous.filter((item) => item.status !== "done"));
    if (added > 0) setMessage(`${added} photo${added === 1 ? "" : "s"} added.`);
    setBusy(false);
    router.refresh();
  }

  const hasBlankAlt = items.some((item) => !item.altText.trim());

  return (
    <div className="max-w-3xl space-y-5">
      <input
        type="file"
        multiple
        accept={ACCEPTED_TYPES.join(",")}
        disabled={busy}
        aria-label="Choose photos"
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = ""; // lets the same file be picked again
        }}
        className={cn(
          fieldStyles,
          "cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2",
          "file:text-xs file:font-medium file:uppercase file:tracking-[0.15em] file:text-accent-foreground",
        )}
      />
      <p className="text-xs text-muted-foreground">
        JPG, PNG or WebP, up to {MAX_MB} MB each. Describe every photo for visitors who use screen
        readers. You can edit this later.
      </p>

      {problems.length > 0 && (
        <Notice tone="warning">
          {problems.map((problem) => (
            <p key={problem}>{problem}</p>
          ))}
        </Notice>
      )}

      {message && <Notice tone="success">{message}</Notice>}

      {items.length > 0 && (
        <>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="space-y-3 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-medium">
                    {item.file.name}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {(item.file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <Badge tone={statusTone[item.status]}>{statusLabel[item.status]}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-9 px-0"
                      aria-label={`Remove ${item.file.name}`}
                      disabled={busy}
                      onClick={() => setItems((previous) => previous.filter((other) => other.id !== item.id))}
                    >
                      <X className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    aria-label={`Alt text for ${item.file.name}`}
                    placeholder="Describe the photo"
                    value={item.altText}
                    maxLength={300}
                    disabled={busy}
                    aria-invalid={!item.altText.trim()}
                    onChange={(event) => patch(item.id, { altText: event.target.value })}
                  />
                  <Input
                    aria-label={`Caption for ${item.file.name}`}
                    placeholder="Caption (optional)"
                    value={item.caption}
                    maxLength={500}
                    disabled={busy}
                    onChange={(event) => patch(item.id, { caption: event.target.value })}
                  />
                </div>

                {item.error && (
                  <p role="alert" className="text-xs text-danger">
                    {item.error}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <Button onClick={uploadAll} disabled={busy || hasBlankAlt}>
            {busy ? "Uploading..." : `Upload ${items.length} photo${items.length === 1 ? "" : "s"}`}
          </Button>
          {hasBlankAlt && !busy && (
            <p className="text-xs text-danger">Every photo needs alt text before you can upload.</p>
          )}
        </>
      )}
    </div>
  );
}