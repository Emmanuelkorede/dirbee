import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BeeLogo } from "@/components/brand/bee-logo";
import { DirectorPreview } from "@/components/director/director-preview";
import { ProjectGrid } from "@/components/projects/project-grid";
import { getFeaturedProjects } from "@/data/projects";

export default function HomePage() {
  const featured = getFeaturedProjects(5);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[85svh] items-center overflow-hidden px-6 pb-16 pt-28 sm:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-1/2 size-[28rem] -translate-y-1/2 text-foreground/[0.06] sm:size-[38rem]"
        >
          <BeeLogo size="100%" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            A creative production house
          </p>

          <h1 className="font-heading text-6xl uppercase leading-[0.95] tracking-tight sm:text-8xl lg:text-9xl">
            House of Bee
          </h1>

          {/* PLACEHOLDER COPY: replace with Bee's wording. */}
          <p className="mt-8 max-w-xl text-lg text-muted-foreground sm:text-xl">
            Visual storytelling. Artist expression. Cinematic experiences.
          </p>

          <Link
            href="/work"
            className="mt-10 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            View work
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Selected work */}
      <section
        aria-labelledby="selected-work-heading"
        className="mx-auto max-w-7xl px-6 sm:px-10"
      >
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2
            id="selected-work-heading"
            className="font-heading text-3xl sm:text-4xl"
          >
            Selected work
          </h2>
          <span className="text-sm text-muted-foreground">
            {String(featured.length).padStart(2, "0")} projects
          </span>
        </div>

        <ProjectGrid projects={featured} className="lg:grid-cols-2" />

        <div className="mt-12 flex justify-end">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            View all work
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <DirectorPreview />
    </>
  );
}