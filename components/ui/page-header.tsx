import type { ReactNode } from "react";

import cn from "@/lib/utils";

const titleSizes = {
  default: "text-3xl sm:text-5xl",
  large: "text-5xl sm:text-7xl",
};

type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  size?: keyof typeof titleSizes;
  className?: string;
};

export function PageHeader({ title, eyebrow, description, actions, size = "default", className }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-3">
        {eyebrow && <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>}
        <h1 className={cn("font-heading uppercase tracking-tight", titleSizes[size])}>{title}</h1>
        {description && (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
        )}
      </div>

      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </header>
  );
}