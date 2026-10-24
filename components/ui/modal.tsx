"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

import cn from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  hideTitle?: boolean; // keeps the title for screen readers only
  size?: "md" | "xl";
  children: ReactNode;
};

export function Modal({ open, onClose, title, hideTitle, size = "md", children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

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
        "m-auto w-[calc(100%-2rem)] rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl",
        "backdrop:bg-black/70 backdrop:backdrop-blur-sm",
        size === "xl" ? "max-w-5xl" : "max-w-lg",
      )}
    >
      <div className="relative p-6 sm:p-8">
        <h2
          id={titleId}
          className={cn("font-heading text-xl uppercase tracking-tight", hideTitle && "sr-only")}
        >
          {title}
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full transition-colors hover:bg-muted"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <div className={cn(!hideTitle && "mt-6")}>{open ? children : null}</div>
      </div>
    </dialog>
  );
}