import type { ActionResult } from "@/types/action";
import { Notice } from "./notice";

type FormMessageProps = {
  result: ActionResult<unknown> | null;
  successText?: string; // nothing is shown on success unless this is given
  className?: string;
};

export function FormMessage({ result, successText, className }: FormMessageProps) {
  if (!result) return null;
  if (result.success && !successText) return null;

  return (
    <Notice
      tone={result.success ? "success" : "danger"}
      role={result.success ? "status" : "alert"}
      className={className}
    >
      {result.success ? successText : result.error}
    </Notice>
  );
}