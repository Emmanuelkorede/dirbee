import { Reveal } from "@/components/ui/reveal";
import type { ProjectWithArtists } from "@/features/projects/types";
import { ProjectCard } from "./project-card";

export function ProjectGrid({ projects }: { projects: ProjectWithArtists[] }) {
  return (
    <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Reveal key={project.id}>
          <ProjectCard project={project} />
        </Reveal>
      ))}
    </div>
  );
}