"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function EmailLink({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the email link above still works.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <a
        href={`mailto:${email}`}
        className="break-all font-heading text-2xl tracking-tight underline decoration-border underline-offset-8 transition-colors hover:decoration-foreground sm:text-4xl"
      >
        {email}
      </a>

      <Button variant="outline" size="sm" onClick={copy} aria-live="polite">
        {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}