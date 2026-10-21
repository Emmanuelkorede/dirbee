"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Maximize2, X } from "lucide-react";

import { WistiaPlayer } from "@/components/projects/wistia-player";

type VideoModalProps = {
  wistiaId: string;
  title: string;
  artist: string;
  // width / height of the video. Defaults to landscape 16:9.
  aspectRatio?: number;
  // The normal inline player, rendered by the page.
  children: ReactNode;
};

export function VideoModal({
  wistiaId,
  title,
  artist,
  aspectRatio = 16 / 9,
  children,
}: VideoModalProps) {
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      // Keep Tab inside the dialog while it is open.
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>("button, iframe")
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open, close]);

  const isPortrait = aspectRatio < 1;

  return (
    <div>
      {open ? (
        <div
          aria-hidden="true"
          className="mx-auto w-full rounded-xl border border-border bg-card"
          style={{
            aspectRatio,
            maxWidth: isPortrait
              ? `min(100%, calc(75svh * ${aspectRatio}))`
              : undefined,
          }}
        />
      ) : (
        children
      )}

      <div className="mt-3 flex justify-end">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
        >
          <Maximize2 className="size-4" aria-hidden="true" />
          Expand player
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="video-modal"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} by ${artist}`}
            className="fixed inset-0 z-[60] flex flex-col bg-espresso/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.25 }}
          >
            <div className="flex items-start justify-between gap-4 px-6 py-4 sm:px-10">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-ivory/70">
                  {artist}
                </p>
                <h2 className="font-heading text-xl text-ivory sm:text-2xl">
                  {title}
                </h2>
              </div>

              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close video"
                className="grid size-11 shrink-0 place-items-center rounded-full border border-ivory/30 text-ivory transition-colors hover:bg-ivory/10 focus-visible:outline-ivory"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            {/* Clicking the empty area around the video also closes it. */}
            <div
              className="grid flex-1 place-items-center px-4 pb-8 sm:px-10"
              onClick={(event) => {
                if (event.target === event.currentTarget) close();
              }}
            >
              <div
                className="w-full"
                style={{
                  // Fit the video inside the screen height, whatever its shape.
                  maxWidth: `min(72rem, calc((100svh - 9rem) * ${aspectRatio}))`,
                }}
              >
                <WistiaPlayer
                  wistiaId={wistiaId}
                  title={title}
                  autoPlay
                  aspectRatio={aspectRatio}
                  className="rounded-lg border-ivory/20"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}