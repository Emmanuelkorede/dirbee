import type { ComponentProps } from "react";

import cn from "@/lib/utils";
import { fieldStyles } from "./input";

export function Textarea({ className, rows = 5, ...props }: ComponentProps<"textarea">) {
  return <textarea rows={rows} className={cn(fieldStyles, "resize-y", className)} {...props} />;
}