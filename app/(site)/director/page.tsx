import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Meet the Director",
  description: "Meet Bee, the director behind House of Bee.",
};

// PLACEHOLDER COPY: replace each of these with Bee's own words.
const intro =
  "Bee is a director working across music visuals, artist content and cinematic storytelling.";

const biography = [
  "This is a placeholder biography. Replace it with Bee's story: where she started, how she got into directing and what drives her work.",
  "Add a second paragraph here about her journey and the kind of projects she is most proud of.",
];

const philosophy =
  "This is a placeholder for Bee's creative philosophy: how she approaches an idea, works with artists and shapes a finished piece.";

// Built from data/projects.ts, with duplicates removed.
const artists = [...new Set(projects.map((project) => project.artist))];
const clients = [...new Set(projects.map((project) => project.client))];

export default function DirectorPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 sm:px-10">
      <header className="grid items-center gap-10 md:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/5] max-w-md overflow-hidden rounded-xl border border-border bg-card md:max-w-none">
          <Image
            src="/images/bee-portrait.jpg"
            alt="Portrait of Director Bee"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            The director
          </p>
          <h1 className="font-heading text-5xl uppercase tracking-tight sm:text-7xl">
            Director Bee
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground">{intro}</p>
        </div>
      </header>

      <div className="mt-24 grid gap-16 md:grid-cols-2 lg:gap-20">
        <section aria-labelledby="biography-heading" className="space-y-5">
          <h2 id="biography-heading" className="font-heading text-3xl">
            Biography
          </h2>
          {biography.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </section>

        <section aria-labelledby="philosophy-heading" className="space-y-5">
          <h2 id="philosophy-heading" className="font-heading text-3xl">
            Creative philosophy
          </h2>
          <p className="leading-relaxed text-muted-foreground">{philosophy}</p>
        </section>
      </div>

      <section aria-labelledby="collaborations-heading" className="mt-24">
        <h2 id="collaborations-heading" className="font-heading text-3xl">
          Artists and clients
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Drawn from the projects shown on this site.
        </p>

        <div className="mt-8 grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Artists
            </h3>
            <ul className="space-y-2">
              {artists.map((artist) => (
                <li key={artist} className="border-b border-border pb-2">
                  {artist}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Clients and labels
            </h3>
            <ul className="space-y-2">
              {clients.map((client) => (
                <li key={client} className="border-b border-border pb-2">
                  {client}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-20 flex flex-wrap items-center gap-6">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
        >
          View selected work
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}