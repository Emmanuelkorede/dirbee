import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function DirectorPreview() {
  return (
    <section className="py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-24">
        <Reveal>
          <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-card">
            <Image
              src="/images/bee-portrait.png"
              alt="Director Bee"
              fill
              sizes="(min-width: 1024px) 28rem, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">The director</p>
          <h2 className="font-heading text-4xl uppercase tracking-tight sm:text-6xl">Meet Bee</h2>
          <p className="max-w-lg leading-relaxed text-foreground/80">
            Bee is the director behind House of Bee, bringing artists&apos; ideas to the screen
            through music visuals, content and cinematic work.
          </p>
          <Link href="/director" className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
            Meet the Director
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}