import type { Metadata } from "next";
import Link from "next/link";

import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "About House of Bee",
  description:
    "House of Bee is a creative production house for music visuals, artist content and cinematic storytelling.",
};

// PLACEHOLDER COPY: replace with the real company text.
const sections = [
  {
    id: "what-we-do",
    title: "What House of Bee does",
    body: "House of Bee is a creative production house making music visuals, artist content and cinematic work. This is placeholder text: replace it with the company's own description.",
  },
  {
    id: "approach",
    title: "Creative approach",
    body: "Placeholder: describe how projects are developed, from the first idea with an artist through to the finished video.",
  },
  {
    id: "vision",
    title: "Vision",
    body: "Placeholder: describe the company's vision and its philosophy on storytelling.",
  },
];

// Built from data/projects.ts, with duplicates removed.
const services = [...new Set(projects.map((project) => project.type))];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-32 sm:px-10">
      <h1 className="font-heading text-5xl uppercase tracking-tight sm:text-7xl">
        About
      </h1>

      <div className="mt-16 space-y-16">
        {sections.map((section) => (
          <section
            key={section.id}
            aria-labelledby={section.id}
            className="grid gap-4 border-t border-border pt-8 md:grid-cols-[1fr_2fr] md:gap-12"
          >
            <h2 id={section.id} className="font-heading text-2xl">
              {section.title}
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}

        <section
          aria-labelledby="services"
          className="grid gap-4 border-t border-border pt-8 md:grid-cols-[1fr_2fr] md:gap-12"
        >
          <h2 id="services" className="font-heading text-2xl">
            Production services
          </h2>
          <ul className="space-y-2">
            {services.map((service) => (
              <li key={service} className="border-b border-border pb-2">
                {service}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-20">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Work with House of Bee
        </Link>
      </div>
    </div>
  );
}