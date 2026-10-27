import { Play } from "lucide-react";
import Link from "next/link";

import { RemoteImage } from "@/components/ui/remote-image";
import type { ProjectWithArtists } from "@/features/projects/types";
import { wistiaThumbnail } from "@/lib/wistia/embed";
import { formatArtistNames, projectTypeLabel } from "@/features/projects/options";
import cn from "@/lib/utils";

type ProjectCardProps = {
  project: ProjectWithArtists;
  featured?: boolean; 
};

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
   const artists = formatArtistNames(project.artists);
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className={cn("relative aspect-video overflow-hidden rounded-xl bg-muted", featured && "lg:aspect-21/9")}>
        {project.wistiaThumbnailUrl && (
          <RemoteImage
            src={wistiaThumbnail(project.wistiaThumbnailUrl, featured ? 1600 : 960)}
            alt=""
            width={featured ? 1600 : 960}
            height={featured ? 900 : 540}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        <span className="absolute inset-0 grid place-items-center bg-black/0 transition-colors duration-300 group-hover:bg-black/25">
          <span className="grid size-14 place-items-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
            <Play className="size-5 fill-current" aria-hidden="true" />
          </span>
        </span>
      </div>

      <div className="mt-4 space-y-1.5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{artists}</p>
        <h3 className={cn("font-heading tracking-tight", featured ? "text-3xl sm:text-4xl" : "text-xl")}>
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground">{projectTypeLabel(project.projectType)}</p>
      </div>
    </Link>
  );
}