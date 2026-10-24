import type { ReactNode } from "react";

import cn from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  eyebrow?: string; // small label above the title
  description?: string;
  actions?: ReactNode; // buttons on the right
  className?: string;
};

export function PageHeader({ title, eyebrow, description, actions, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-3">
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>
        )}
        <h1 className="font-heading text-3xl uppercase tracking-tight sm:text-5xl">{title}</h1>
        {description && (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>

      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </header>
  );
}