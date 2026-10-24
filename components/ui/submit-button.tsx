"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "./button";

type SubmitButtonProps = Omit<ComponentProps<typeof Button>, "type"> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Saving...",
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}