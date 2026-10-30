"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

import cn from "@/lib/utils";

const sizes = {
  md: "max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl",
  xl: "max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl",
  full: "h-dvh w-dvw max-h-none max-w-none bg-background",
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string; // small caps line above the title
  hideTitle?: boolean; // keeps the title for screen readers only
  size?: keyof typeof sizes;
  children: ReactNode;
};

export function Modal({ open, onClose, title, eyebrow, hideTitle, size = "md", children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const isFull = size === "full";

  // The native <dialog> handles focus trapping and the Escape key.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Stop the page behind from scrolling.
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose} // also fires on Escape
      onClick={(event) => {
        // A click on the dark backdrop targets the dialog itself.
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "m-auto p-0 text-card-foreground backdrop:bg-black/70 backdrop:backdrop-blur-sm",
        sizes[size],
      )}
    >
      <div className={cn("flex flex-col", isFull ? "h-dvh p-6 sm:p-10" : "p-6 sm:p-8")}>
        <div className="flex items-start justify-between gap-4">
          <div className={cn("space-y-1", hideTitle && "sr-only")}>
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>
            )}
            <h2 id={titleId} className="font-heading text-xl tracking-tight sm:text-2xl">{title}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ml-auto grid size-11 shrink-0 place-items-center rounded-full border border-border transition-colors hover:bg-muted"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        
        <div className={cn(isFull ? "grid min-h-0 flex-1 place-items-center pt-4" : "mt-6")}>
          {open ? children : null}
        </div>
      </div>
    </dialog>
  );
}