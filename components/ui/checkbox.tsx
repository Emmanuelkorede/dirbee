import type { ComponentProps, ReactNode } from "react";

import cn from "@/lib/utils";

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label: ReactNode;
  description?: string;
};

export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3", className)}>
      <input type="checkbox" className="mt-1 size-4 shrink-0 cursor-pointer accent-accent" {...props} />
      <span className="space-y-1">
        <span className="block text-sm">{label}</span>
        {description && <span className="block text-xs text-muted-foreground">{description}</span>}
      </span>
    </label>
  );
}