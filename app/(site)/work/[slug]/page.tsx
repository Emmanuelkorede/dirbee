import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { RelatedProjects } from "@/components/projects/related-projects";
import { VideoModal } from "@/components/projects/video-modal";
import { WistiaPlayer } from "@/components/projects/wistia-player";
import { getProjectBySlug, projects } from "@/data/projects";
import { getWistiaAspectRatio } from "@/lib/video/wistia-thumbnail";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};


export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return { title: "Project not found" };

  return {
    title: `${project.title} | ${project.artist}`,
    description:
      project.description ??
      `${project.type} for ${project.artist}. Work by House of Bee.`,
  };
}

type Detail = { label: string; value: string };

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const aspectRatio =
    project.aspectRatio ?? (await getWistiaAspectRatio(project.wistiaId));

  // Only rows that contain real data are shown.
  const details = [
    { label: "Client", value: project.client },
    { label: "Artist", value: project.artist },
    { label: "Type", value: project.type },
    project.services?.length
      ? { label: "Services", value: project.services.join(", ") }
      : null,
    project.year ? { label: "Year", value: String(project.year) } : null,
    project.description
      ? { label: "Overview", value: project.description }
      : null,
  ].filter((detail): detail is Detail => detail !== null);

  return (
    <article>
      <div className="mx-auto max-w-6xl px-6 pt-28 sm:px-10">
        <Link
          href="/work"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          All work
        </Link>

        <VideoModal
          wistiaId={project.wistiaId}
          title={project.title}
          artist={project.artist}
          aspectRatio={aspectRatio}
        >
          <WistiaPlayer
            wistiaId={project.wistiaId}
            title={project.title}
            aspectRatio={aspectRatio}
          />
        </VideoModal>

        <h1 className="mt-10 font-heading text-4xl uppercase tracking-tight sm:text-6xl">
          {project.title}
        </h1>

        <dl className="mt-10 border-b border-border">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="grid gap-1 border-t border-border py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
            >
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {detail.label}
              </dt>
              <dd className="text-base">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-20 sm:px-10">
        <RelatedProjects project={project} />
      </div>
    </article>
  );
}