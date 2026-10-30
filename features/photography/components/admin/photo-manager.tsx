"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { ActionButton } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { deletePhotoAction, reorderPhotosAction, updatePhotoAction } from "@/features/photography/actions";
import { cloudinaryImage } from "@/lib/cloudinary/delivery";
import type { ActionResult } from "@/types/action";
import type { Photo } from "@/types/database";

type RowProps = {
  photo: Photo;
  index: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
};

function PhotoRow({ photo, index, count, onMove }: RowProps) {
  const router = useRouter();
  const [altText, setAltText] = useState(photo.altText);
  const [caption, setCaption] = useState(photo.caption ?? "");
  const [result, setResult] = useState<ActionResult<unknown> | null>(null);
  const [pending, startTransition] = useTransition();

  const changed = altText !== photo.altText || caption !== (photo.caption ?? "");

  function save() {
    startTransition(async () => {
      const response = await updatePhotoAction({ id: photo.id, altText, caption });
      setResult(response);
      if (response.success) router.refresh();
    });
  }

  return (
    <li className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row">
      {/* Plain <img>: a resized copy comes from Cloudinary, see lib/cloudinary/delivery.ts */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cloudinaryImage(photo.imageUrl, 400)}
        alt={photo.altText}
        loading="lazy"
        className="aspect-4/3 w-full rounded-lg object-cover sm:w-40"
      />

      <div className="flex-1 space-y-3">
        <Input
          aria-label={`Alt text for photo ${index + 1}`}
          value={altText}
          maxLength={300}
          aria-invalid={!altText.trim()}
          onChange={(event) => setAltText(event.target.value)}
        />
        <Input
          aria-label={`Caption for photo ${index + 1}`}
          placeholder="Caption (optional)"
          value={caption}
          maxLength={500}
          onChange={(event) => setCaption(event.target.value)}
        />
        <FormMessage result={result} />

        <div className="flex flex-wrap items-start gap-2">
          <Button size="sm" onClick={save} disabled={!changed || !altText.trim() || pending}>
            {pending ? "Saving..." : "Save text"}
          </Button>
          <ActionButton
            action={deletePhotoAction}
            id={photo.id}
            variant="danger"
            size="sm"
            confirmMessage="Delete this photo? It is also removed from Cloudinary."
          >
            Delete
          </ActionButton>
        </div>
      </div>

      <div className="flex gap-1 sm:flex-col">
        <Button variant="ghost" size="sm" className="size-9 px-0" aria-label="Move up"
          disabled={index === 0} onClick={() => onMove(-1)}>
          <ChevronUp className="size-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="sm" className="size-9 px-0" aria-label="Move down"
          disabled={index === count - 1} onClick={() => onMove(1)}>
          <ChevronDown className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}

export function PhotoManager({ shootId, photos }: { shootId: string; photos: Photo[] }) {
  const router = useRouter();
  const [order, setOrder] = useState(() => photos.map((photo) => photo.id));
  const [result, setResult] = useState<ActionResult<unknown> | null>(null);
  const [pending, startTransition] = useTransition();

  const byId = new Map(photos.map((photo) => [photo.id, photo]));
  const orderChanged = order.join(",") !== photos.map((photo) => photo.id).join(",");

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;

    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    setResult(null);
  }

  function saveOrder() {
    startTransition(async () => {
      const response = await reorderPhotosAction({ shootId, photoIds: order });
      setResult(response);
      if (response.success) router.refresh();
    });
  }

  if (photos.length === 0) {
    return <p className="text-sm text-muted-foreground">No photos yet. Upload some above.</p>;
  }

  return (
    <div className="max-w-3xl space-y-4">
      <ul className="space-y-3">
        {order.map((id, index) => {
          const photo = byId.get(id);
          if (!photo) return null;

          return (
            <PhotoRow key={id} photo={photo} index={index} count={order.length}
              onMove={(direction) => move(index, direction)} />
          );
        })}
      </ul>

      <FormMessage result={result} successText="Photo order saved." />

      <Button onClick={saveOrder} disabled={!orderChanged || pending}>
        {pending ? "Saving..." : "Save photo order"}
      </Button>
    </div>
  );
}