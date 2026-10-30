"use client";

import { useState } from "react";

import { Reveal } from "@/components/ui/reveal";
import { projectGroup, WORK_FILTERS, type WorkFilter } from "@/features/projects/options";
import type { ProjectWithArtists } from "@/features/projects/types";
import cn from "@/lib/utils";
import { ProjectCard } from "./project-card";

export function ProjectGrid({ projects }: { projects: ProjectWithArtists[] }) {
  const [filter, setFilter] = useState<WorkFilter>("all");

  // Filters only make sense when there is something in both groups.
  const hasEditorial = projects.some((project) => projectGroup(project.projectType) === "editorial");
  const hasMusicVideo = projects.some((project) => projectGroup(project.projectType) === "music_video");
  const showFilters = hasEditorial && hasMusicVideo;

  const shown =
    filter === "all" ? projects : projects.filter((project) => projectGroup(project.projectType) === filter);

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors",
      active
        ? "border-accent bg-accent text-accent-foreground"
        : "border-border text-muted-foreground hover:bg-card hover:text-foreground",
    );

  return (
    <div className="space-y-10">
      {showFilters && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
          {WORK_FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              aria-pressed={filter === item.key}
              className={chip(filter === item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((project) => (
          <Reveal key={project.id}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}