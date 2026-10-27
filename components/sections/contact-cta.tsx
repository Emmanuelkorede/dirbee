import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function ContactCta() {
  return (
    <section className="rounded-3xl border border-border bg-card px-8 py-14 text-center sm:py-20">
      <Reveal className="mx-auto max-w-2xl space-y-6">
        <h2 className="font-heading text-3xl uppercase tracking-tight sm:text-5xl">Have a project in mind?</h2>
        <p className="text-muted-foreground">Tell us about the artist, the song and the timeline.</p>
        <Link href="/contact" className={buttonStyles()}>Start a project</Link>
      </Reveal>
    </section>
  );
}