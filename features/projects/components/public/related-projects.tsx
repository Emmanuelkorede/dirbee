import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ProjectWithArtists } from "@/features/projects/types";
import { ProjectCard } from "./project-card";

export function RelatedProjects({ projects }: { projects: ProjectWithArtists[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="space-y-8">
      <SectionHeading title="Related projects" />
      <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Reveal key={project.id}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}