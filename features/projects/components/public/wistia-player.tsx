"use client";

import { Maximize2, Play, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { RemoteImage } from "@/components/ui/remote-image";
import cn from "@/lib/utils";
import { getWistiaEmbed, wistiaThumbnail } from "@/lib/wistia/embed";

type WistiaPlayerProps = {
  mediaId: string;
  title: string;
  artistNames: string; // shown above the title in the expanded view
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
};

export function WistiaPlayer({ mediaId, title, artistNames, thumbnailUrl, width, height }: WistiaPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const embed = getWistiaEmbed(mediaId, width, height);

  // While expanded: Escape closes the view and the page behind stops scrolling.
  useEffect(() => {
    if (!expanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [expanded]);

  if (!embed) return null;

  const ratio = embed.aspectRatio;

  // IMPORTANT: the iframe must stay in the same place in this tree for both views,
  // otherwise React would rebuild it and the video would restart.
  return (
    <div
      className={cn(expanded ? "fixed inset-0 z-[60] flex flex-col bg-background p-6 sm:p-10" : "space-y-3")}
      role={expanded ? "dialog" : undefined}
      aria-modal={expanded || undefined}
      aria-label={expanded ? `${title} player` : undefined}
    >
      {expanded && (
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{artistNames}</p>
            <p className="font-heading text-xl tracking-tight sm:text-2xl">{title}</p>
          </div>

          <button
            type="button"
            autoFocus
            onClick={() => setExpanded(false)}
            aria-label="Close expanded player"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border transition-colors hover:bg-muted"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className={cn(expanded && "grid min-h-0 flex-1 place-items-center pt-4")}>
        <div
          className="relative mx-auto overflow-hidden rounded-2xl bg-black"
          style={{
            aspectRatio: ratio,
            // Normal: never taller than 80% of the screen. Expanded: as big as fits.
            width: expanded
              ? `min(100%, calc((100dvh - 9rem) * ${ratio}))`
              : `min(100%, calc(80svh * ${ratio}))`,
          }}
        >
          {playing ? (
            <iframe
              src={`${embed.iframeSrc}?videoFoam=true&autoPlay=true`}
              title={title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
          ) : (
            // The Wistia iframe only loads after a click, which keeps the page fast.
            <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${title}`} className="group absolute inset-0">
              {thumbnailUrl && (
                <RemoteImage
                  src={wistiaThumbnail(thumbnailUrl, 1600, Math.round(1600 / ratio))}
                  alt=""
                  className="size-full object-cover"
                />
              )}
              <span className="absolute inset-0 grid place-items-center bg-black/20 transition-colors group-hover:bg-black/35">
                <span className="grid size-20 place-items-center rounded-full bg-background/85 text-foreground backdrop-blur-md transition-transform group-hover:scale-110">
                  <Play className="size-7 fill-current" aria-hidden="true" />
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      {!expanded && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setExpanded(true)}>
            <Maximize2 className="size-4" aria-hidden="true" />
            Expand player
          </Button>
        </div>
      )}
    </div>
  );
}