import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ProjectWithArtists } from "@/features/projects/types";
import { ProjectCard } from "./project-card";

export function FeaturedProjects({ projects }: { projects: ProjectWithArtists[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="py-16">
      <Container className="space-y-10">
        <SectionHeading title="Selected work" href="/work" linkLabel="View all work" />

        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.id} className={index === 0 ? "sm:col-span-2 lg:col-span-3" : undefined}>
              <ProjectCard project={project} featured={index === 0} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}