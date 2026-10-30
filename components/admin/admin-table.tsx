import type { ComponentProps } from "react";

import cn from "@/lib/utils";

export function AdminTable({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className={cn("w-full min-w-[40rem] text-left text-sm", className)} {...props} />
    </div>
  );
}

export function Tr({ className, ...props }: ComponentProps<"tr">) {
  return <tr className={cn("group", className)} {...props} />;
}

export function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "border-b border-border bg-card px-4 py-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn("border-b border-border px-4 py-3 align-middle group-last:border-b-0", className)}
      {...props}
    />
  );
}