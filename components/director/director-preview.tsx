import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DirectorPreview() {
  return (
    <section
      aria-labelledby="director-preview-heading"
      className="mx-auto max-w-7xl px-6 pt-28 sm:px-10"
    >
      <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/5] max-w-md overflow-hidden rounded-xl border border-border bg-card md:max-w-none">
          <Image
            src="/images/bee-portrait.png"
            alt="Portrait of Director Bee"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            The director
          </p>

          <h2
            id="director-preview-heading"
            className="font-heading text-4xl uppercase tracking-tight sm:text-5xl"
          >
            Meet Bee
          </h2>

          {/* PLACEHOLDER COPY: replace with Bee's own introduction. */}
          <p className="max-w-md text-muted-foreground">
            Bee is the director behind House of Bee, bringing artists&apos;
            ideas to the screen through music visuals, content and cinematic
            work.
          </p>

          <Link
            href="/director"
            className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            Meet the Director
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}