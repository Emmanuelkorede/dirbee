import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getPublishedNames } from "@/features/projects/queries";

export const metadata: Metadata = {
  title: "Meet the Director",
  description: "Meet Director Bee, the Lagos-based visual strategist and director behind House of Bee.",
};

function NameList({ title, names }: { title: string; names: string[] }) {
  if (names.length === 0) return null;

  return (
    <div>
      <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</h3>
      <ul className="divide-y divide-border border-b border-border">
        {names.map((name) => (
          <li key={name} className="py-3">{name}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function DirectorPage() {
  const { artists: artistNames, clients: clientNames } = await getPublishedNames();

  return (
    <Container className="space-y-24 py-12 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-24">
        <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-card">
          <Image
            src="/images/bee-portrait.png"
            alt="Director Bee"
            fill
            priority
            sizes="(min-width: 1024px) 28rem, 100vw"
            className="object-cover"
          />
        </div>

        <Reveal className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">The director</p>
          <h1 className="font-heading text-5xl uppercase leading-none tracking-tight sm:text-7xl">Director Bee</h1>
          <p className="max-w-xl leading-relaxed text-foreground/80">
            Director Bee is a Lagos-based visual strategist and director crafting immersive visual
            worlds that push African music beyond the expected. Her work lives at the intersection of
            culture and the surreal; where grounded realities meet elevated, almost supernatural
            expressions.
          </p>
        </Reveal>
      </div>

      <Reveal className="grid gap-12 md:grid-cols-2 md:gap-16">
        <section className="space-y-5">
          <h2 className="font-heading text-3xl tracking-tight">Biography</h2>
          <p className="leading-relaxed text-foreground/80">
            Known for translating bold concepts into striking visuals, she approaches every frame as
            both art and strategy. From shaping an artist’s visual identity to directing full-scale
            productions, she builds cohesive rollouts that don’t just support the music, but expand
            its reach and impact.
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="font-heading text-3xl tracking-tight">Creative philosophy</h2>
          <p className="leading-relaxed text-foreground/80">
            Her philosophy is rooted in narrative longevity. In a fast-moving content landscape, she
            focuses on creating distinct visual languages that position artists for global
            recognition. Based in Lagos, Nigeria, she works with artists and teams across markets on
            projects and select collaborations, bringing a refined West African perspective to the
            global stage.
          </p>
        </section>
      </Reveal>

      {(artistNames.length > 0 || clientNames.length > 0) && (
        <Reveal className="space-y-8">
          <div className="space-y-2">
            <h2 className="font-heading text-3xl tracking-tight">Artists and clients</h2>
            <p className="text-sm text-muted-foreground">Drawn from the projects shown on this site.</p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <NameList title="Artists" names={artistNames} />
            <NameList title="Clients and labels" names={clientNames} />
          </div>
        </Reveal>
      )}

      <div className="flex flex-wrap items-center gap-6">
        <Link href="/work" className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
          View selected work
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link href="/contact" className={buttonStyles()}>Get in touch</Link>
      </div>
    </Container>
  );
}