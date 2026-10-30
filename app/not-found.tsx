import Link from "next/link";

import { BeeLogo } from "@/components/brand/bee-logo";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-20 text-center">
      <div className="space-y-8">
        <BeeLogo size={56} className="mx-auto" />

        <div className="space-y-3">
          <p aria-hidden="true" className="font-heading text-8xl leading-none tracking-tight sm:text-9xl">
            404
          </p>
          <h1 className="font-heading text-2xl uppercase tracking-tight sm:text-3xl">Page not found</h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            The page you are looking for does not exist, or it has moved.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonStyles()}>Back home</Link>
          <Link href="/work" className={buttonStyles({ variant: "outline" })}>View work</Link>
        </div>
      </div>
    </main>
  );
}