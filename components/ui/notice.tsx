import type { ComponentProps } from "react";

import cn from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "border-border bg-card text-card-foreground",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
};

export function Notice({
  tone = "neutral",
  className,
  ...props
}: ComponentProps<"div"> & { tone?: Tone }) {
  return (
    <div className={cn("rounded-lg border px-4 py-3 text-sm", tones[tone], className)} {...props} />
  );
}