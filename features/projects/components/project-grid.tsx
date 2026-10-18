import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/data/projects";
import { getWistiaThumbnail } from "@/lib/video/wistia-thumbnail";
import cn from "@/lib/utils";

type ProjectGridProps = {
  projects: Project[];
  className?: string;
};

export async function ProjectGrid({ projects, className }: ProjectGridProps) {
  const thumbnails = await Promise.all(
    projects.map((project) => getWistiaThumbnail(project.wistiaId))
  );

  return (
    <ul
      className={cn(
        "grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {projects.map((project, index) => (
        <li key={project.id}>
          <ProjectCard
            project={project}
            thumbnailUrl={thumbnails[index]}
            index={index}
          />
        </li>
      ))}
    </ul>
  );
}