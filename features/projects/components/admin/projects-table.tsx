import Link from "next/link";

import { AdminTable, Td, Th, Tr } from "@/components/admin/admin-table";
import { ActionButton } from "@/components/ui/action-button";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import {
  deleteProjectAction,
  publishProjectAction,
  unpublishProjectAction,
} from "@/features/projects/actions";
import { projectTypeLabel } from "@/features/projects/options";
import type { ProjectWithArtists } from "@/features/projects/types";

export function ProjectsTable({ projects }: { projects: ProjectWithArtists[] }) {
  return (
    <AdminTable className="min-w-[56rem]">
      <thead>
        <tr>
          <Th>Project</Th>
          <Th>Type</Th>
          <Th>Artists</Th>
          <Th>Status</Th>
          <Th />
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => {
          const published = project.status === "published";

          return (
            <Tr key={project.id}>
              <Td>
                <Link href={`/admin/projects/${project.id}/edit`} className="font-medium hover:underline">
                  {project.title}
                </Link>
                <p className="text-xs text-muted-foreground">{project.projectYear}</p>
              </Td>
              <Td>{projectTypeLabel(project.projectType)}</Td>
              <Td className="text-muted-foreground">
                {project.artists.map((artist) => artist.name).join(", ")}
              </Td>
              <Td>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={published ? "success" : "warning"}>{published ? "Published" : "Draft"}</Badge>
                  {project.isFeatured && <Badge>Featured</Badge>}
                </div>
              </Td>
              <Td>
                <div className="flex items-start justify-end gap-2">
                  <Link href={`/admin/projects/${project.id}/edit`}
                    className={buttonStyles({ variant: "outline", size: "sm" })}>
                    Edit
                  </Link>

                  {published ? (
                    <ActionButton action={unpublishProjectAction} id={project.id} variant="outline" size="sm"
                      confirmMessage={`Unpublish "${project.title}"? It will also leave the homepage featured list.`}>
                      Unpublish
                    </ActionButton>
                  ) : (
                    <ActionButton action={publishProjectAction} id={project.id} size="sm"
                      disabled={!project.wistiaMediaId}
                      title={project.wistiaMediaId ? undefined : "Sync the Wistia video first"}>
                      Publish
                    </ActionButton>
                  )}

                  <ActionButton action={deleteProjectAction} id={project.id} variant="danger" size="sm"
                    confirmMessage={`Delete "${project.title}" permanently?`}>
                    Delete
                  </ActionButton>
                </div>
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </AdminTable>
  );
}