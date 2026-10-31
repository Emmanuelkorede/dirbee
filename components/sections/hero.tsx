import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { BeeLogo } from "@/components/brand/bee-logo";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[19vw] top-1/2 aspect-square w-[96vw] -translate-y-[52%] text-foreground opacity-[0.06] md:-right-[6vw] md:w-[min(48vw,640px)]"
      >
        <BeeLogo size="100%" />
      </div>

      <Container className="relative py-10 sm:py-16">
        <Reveal className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">A creative production house</p>

          <h1 className="font-heading text-[12vw] uppercase leading-none tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
            House of Bee
          </h1>

          <p className="max-w-2xl text-lg text-foreground/80 sm:text-2xl">
            Campaign Rollouts. Visual Direction. Creative Development.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link href="/work" className={buttonStyles()}>
              View work
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className={buttonStyles({ variant: "outline" })}>
              Get in touch
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}