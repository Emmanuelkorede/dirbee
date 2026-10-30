import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ProjectDetails } from "@/features/projects/components/public/project-details";
import { RelatedProjects } from "@/features/projects/components/public/related-projects";
import { WistiaPlayer } from "@/features/projects/components/public/wistia-player";
import { projectTypeLabel } from "@/features/projects/options";
import { getProjectBySlug, getPublishedProjects, getRelatedProjects } from "@/features/projects/queries";
import { wistiaThumbnail } from "@/lib/wistia/embed";

type Props = { params: Promise<{ slug: string }> };

// Used by both the metadata and the page, but only queries once.
const loadProject = cache(getProjectBySlug);

// Every published project is built ahead of time. New ones are built on first visit.
export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) return { title: "Project not found" };

  const description = project.description.slice(0, 160);
  const image = project.wistiaThumbnailUrl
    ? wistiaThumbnail(project.wistiaThumbnailUrl, 1200, 630)
    : undefined;

  return {
    title: project.title,
    description,
    openGraph: { title: project.title, description, images: image ? [image] : undefined },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project || !project.wistiaMediaId) notFound();

  const related = await getRelatedProjects(project.id, 3);
  const artistNames = project.artists.map((artist) => artist.name).join(", ");

  // The table: client, artists, type, year, then every credit.
  const rows: { label: string; value: string }[] = [];
  if (project.client) rows.push({ label: "Client", value: project.client.name });
  rows.push({ label: project.artists.length > 1 ? "Artists" : "Artist", value: artistNames });
  rows.push({ label: "Type", value: projectTypeLabel(project.projectType) });
  rows.push({ label: "Year", value: String(project.projectYear) });
  for (const credit of project.credits) rows.push(credit);

  return (
    <Container size="medium" className="space-y-16 py-12 sm:py-16">
      <div className="space-y-6">
        <Link href="/work" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" />
          All work
        </Link>

        <Reveal>
          <WistiaPlayer
            mediaId={project.wistiaMediaId}
            title={project.title}
            artistNames={artistNames}
            thumbnailUrl={project.wistiaThumbnailUrl}
            width={project.videoWidth}
            height={project.videoHeight}
          />
        </Reveal>
      </div>

      <div className="space-y-10">
        <h1 className="font-heading text-5xl uppercase leading-none tracking-tight sm:text-7xl">{project.title}</h1>

        {/* Delete this line if you do not want the description shown publicly. */}
        <p className="max-w-2xl whitespace-pre-line leading-relaxed text-foreground/80">{project.description}</p>

        <ProjectDetails rows={rows} />
      </div>

      <RelatedProjects projects={related} />
    </Container>
  );
}