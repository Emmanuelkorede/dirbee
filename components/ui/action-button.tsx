"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type ComponentProps, type ReactNode } from "react";

import type { ActionResult } from "@/types/action";
import { Button } from "./button";
import { Modal } from "./modal";

type ActionButtonProps = Omit<ComponentProps<typeof Button>, "onClick" | "type"> & {
  action: (id: string) => Promise<ActionResult<unknown>>;
  id: string;
  confirmMessage?: string; 
  confirmTitle?: string;
  confirmLabel?: ReactNode; 
};

export function ActionButton({
  action,
  id,
  confirmMessage,
  confirmTitle = "Are you sure?",
  confirmLabel,
  children,
  disabled,
  variant,
  ...props
}: ActionButtonProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  function run() {
    setError("");
    startTransition(async () => {
      const result = await action(id);
      if (!result.success) setError(result.error); 
      setConfirming(false);
      router.refresh(); 
    });
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button
        variant={variant}
        disabled={pending || disabled}
        onClick={() => (confirmMessage ? setConfirming(true) : run())}
        {...props}
      >
        {pending && !confirming ? "Working..." : children}
      </Button>

      {error && (
        <span role="alert" className="max-w-xs text-xs text-danger">
          {error}
        </span>
      )}

      {confirmMessage && (
        <Modal
          open={confirming}
          onClose={() => !pending && setConfirming(false)} // no closing while it is working
          title={confirmTitle}
          size="md"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">{confirmMessage}</p>

          <div className="mt-8 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirming(false)} disabled={pending}>
              Cancel
            </Button>
            <Button variant={variant === "danger" ? "danger" : "primary"} onClick={run} disabled={pending}>
              {pending ? "Working..." : (confirmLabel ?? children)}
            </Button>
          </div>
        </Modal>
      )}
    </span>
  );
}