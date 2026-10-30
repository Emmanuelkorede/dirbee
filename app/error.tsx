"use client";

import Link from "next/link";
import { useEffect } from "react";

import { BeeLogo } from "@/components/brand/bee-logo";
import { Button, buttonStyles } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry?: () => void; 
  reset?: () => void; 
};

export default function ErrorPage({ error, unstable_retry, reset }: ErrorPageProps) {
  const retry = unstable_retry ?? reset;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center px-6 py-20 text-center">
      <div className="space-y-8">
        <BeeLogo size={56} className="mx-auto" />

        <div className="space-y-3">
          <h1 className="font-heading text-4xl uppercase tracking-tight sm:text-6xl">Something went wrong</h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            We hit an unexpected problem loading this page. Please try again, and if it keeps
            happening, come back in a little while.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {retry && <Button onClick={() => retry()}>Try again</Button>}
          <Link href="/" className={buttonStyles({ variant: "outline" })}>Back home</Link>
        </div>
      </div>
    </main>
  );
}