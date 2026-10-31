import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ProjectWithArtists } from "@/features/projects/types";
import { ProjectCard } from "./project-card";

export function FeaturedProjects({ projects }: { projects: ProjectWithArtists[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="py-8 sm:py-12">
      <Container className="space-y-6 sm:space-y-8">
        <SectionHeading title="Selected work" />

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.id} className={index === 0 ? "sm:col-span-2 lg:col-span-3" : undefined}>
              <ProjectCard project={project} featured={index === 0} />
            </Reveal>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <Link href="/work" className={buttonStyles({ variant: "outline" })}>
            View all work
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}