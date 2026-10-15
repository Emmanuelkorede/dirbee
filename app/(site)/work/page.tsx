import type { Metadata } from "next";

import { ProjectGrid } from "@/components/projects/project-grid";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Music videos, visualizers, artist unveiling videos, performance reels and content by House of Bee.",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-32 sm:px-10">
      <header className="mb-12">
        <h1 className="font-heading text-5xl uppercase tracking-tight sm:text-7xl">
          Work
        </h1>
        <p className="mt-4 text-muted-foreground">
          {projects.length} projects
        </p>
      </header>

      <h2 className="sr-only">All projects</h2>
      <ProjectGrid projects={projects} />
    </div>
  );
}