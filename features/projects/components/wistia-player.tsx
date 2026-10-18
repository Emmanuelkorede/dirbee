import { VideoOff } from "lucide-react";

import { getWistiaEmbedUrl, isValidWistiaId } from "@/lib/video/wistia";
import cn from "@/lib/utils";

type WistiaPlayerProps = {
  wistiaId: string | null;
  title: string;
  autoPlay?: boolean;
  // width / height of the video. Defaults to landscape 16:9.
  aspectRatio?: number;
  className?: string;
};

export function WistiaPlayer({
  wistiaId,
  title,
  autoPlay = false,
  aspectRatio = 16 / 9,
  className,
}: WistiaPlayerProps) {
  const isPortrait = aspectRatio < 1;

  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
      style={{
        aspectRatio,
        maxWidth: isPortrait
          ? `min(100%, calc(75svh * ${aspectRatio}))`
          : undefined,
      }}
    >
      {isValidWistiaId(wistiaId) ? (
        <iframe
          src={getWistiaEmbedUrl(wistiaId, { autoPlay })}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <div className="space-y-3 text-muted-foreground">
            <VideoOff className="mx-auto size-8" aria-hidden="true" />
            <p className="text-sm">This video is coming soon.</p>
          </div>
        </div>
      )}
    </div>
  );
}