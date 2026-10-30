import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ProjectGrid } from "@/features/projects/components/public/project-grid";
import { getPublishedProjects } from "@/features/projects/queries";

export const metadata: Metadata = {
  title: "Work",
  description: "Music videos, visualizers, artist unveilings and more from House of Bee.",
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();

  return (
    <Container className="space-y-14 py-12 sm:py-20">
      <PageHeader
        size="large"
        title="Work"
        description={`${projects.length} project${projects.length === 1 ? "" : "s"}`}
      />

      {projects.length === 0 ? (
        <EmptyState title="Work coming soon" description="New projects will appear here." />
      ) : (
        <ProjectGrid projects={projects} />
      )}
    </Container>
  );
}