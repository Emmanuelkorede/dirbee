import { ProjectGrid } from "@/features/projects/components/project-grid";
import { getRelatedProjects, type Project } from "@/features/projects/queries";

type RelatedProjectsProps = {
  project: Project;
};

export function RelatedProjects({ project }: RelatedProjectsProps) {
  const related = getRelatedProjects(project);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-projects-heading">
      <h2
        id="related-projects-heading"
        className="mb-8 font-heading text-2xl sm:text-3xl"
      >
        Related projects
      </h2>
      <ProjectGrid projects={related} />
    </section>
  );
}