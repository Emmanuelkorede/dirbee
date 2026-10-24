import type { ComponentProps } from "react";

import cn from "@/lib/utils";

// Shared by Input, Textarea and Select so every field looks the same.
// Pass aria-invalid={true} to show the error border.
export const fieldStyles =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground " +
  "placeholder:text-muted-foreground transition-colors focus:border-accent focus:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50 " +
  "aria-invalid:border-danger";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldStyles, className)} {...props} />;
}