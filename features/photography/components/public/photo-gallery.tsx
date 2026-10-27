"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { RemoteImage } from "@/components/ui/remote-image";
import { cloudinaryImage } from "@/lib/cloudinary/delivery";
import type { Photo } from "@/types/database";

export function PhotoGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [active, setActive] = useState<number | null>(null);

  const step = useCallback(
    (direction: -1 | 1) => {
      setActive((current) =>
        current === null ? null : (current + direction + photos.length) % photos.length,
      );
    },
    [photos.length],
  );

  useEffect(() => {
    if (active === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, step]);

  const photo = active === null ? null : photos[active];

  return (
    <>
      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((item, index) => (
          <li key={item.id} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Open photo ${index + 1} of ${photos.length}: ${item.altText}`}
              className="group block w-full overflow-hidden rounded-xl bg-muted"
            >
              <RemoteImage
                src={cloudinaryImage(item.imageUrl, 800)}
                alt={item.altText}
                // Width and height stop the page jumping while images load.
                width={item.width ?? undefined}
                height={item.height ?? undefined}
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      <Modal open={photo !== null} onClose={() => setActive(null)} title={`${title} photos`} hideTitle size="xl">
        {photo && (
          <figure className="space-y-4">
            <div className="relative">
              <RemoteImage
                src={cloudinaryImage(photo.imageUrl, 1800)}
                alt={photo.altText}
                loading="eager"
                className="mx-auto max-h-[75svh] w-auto max-w-full rounded-lg object-contain"
              />

              {photos.length > 1 && (
                <>
                  <Button variant="outline" aria-label="Previous photo" onClick={() => step(-1)}
                    className="absolute left-2 top-1/2 size-11 -translate-y-1/2 px-0 backdrop-blur-md">
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </Button>
                  <Button variant="outline" aria-label="Next photo" onClick={() => step(1)}
                    className="absolute right-2 top-1/2 size-11 -translate-y-1/2 px-0 backdrop-blur-md">
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </Button>
                </>
              )}
            </div>

            {photo.caption && (
              <figcaption className="text-center text-sm text-muted-foreground">{photo.caption}</figcaption>
            )}
          </figure>
        )}
      </Modal>
    </>
  );
}