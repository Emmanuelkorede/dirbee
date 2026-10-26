"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ComponentProps } from "react";

import type { ActionResult } from "@/types/action";
import { Button } from "./button";

type ActionButtonProps = Omit<ComponentProps<typeof Button>, "onClick" | "type"> & {
  action: (id: string) => Promise<ActionResult<unknown>>;
  id: string;
  confirmMessage?: string; // asks "are you sure?" first
};

export function ActionButton({
  action,
  id,
  confirmMessage,
  children,
  disabled,
  ...props
}: ActionButtonProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    setError("");
      startTransition(async () => {
      const result = await action(id);
      if (!result.success) setError(result.error);
      router.refresh(); // also after a failure: a partial delete may have changed the data
    });
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button onClick={handleClick} disabled={pending || disabled} {...props}>
        {pending ? "Working..." : children}
      </Button>
      {error && (
        <span role="alert" className="max-w-xs text-xs text-danger">
          {error}
        </span>
      )}
    </span>
  );
}