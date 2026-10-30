import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionButton } from "@/components/ui/action-button";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { PageHeader } from "@/components/ui/page-header";
import { getArtists } from "@/features/artists/queries";
import { getClients } from "@/features/clients/queries";
import { publishProjectAction, unpublishProjectAction } from "@/features/projects/actions";
import { ProjectForm } from "@/features/projects/components/admin/project-form";
import { WistiaSyncStatus } from "@/features/projects/components/admin/wistia-sync-status";
import { getProjectById } from "@/features/projects/queries";
import { requireAdmin } from "@/lib/auth/require-admin";

type Props = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ created?: string; syncWarning?: string }>;
};

export default async function EditProjectPage({ params, searchParams }: Props) {
  await requireAdmin();

  const { projectId } = await params;
  const { created, syncWarning } = await searchParams;

  const [project, artists, clients] = await Promise.all([
    getProjectById(projectId),
    getArtists(),
    getClients(),
  ]);
  if (!project) notFound();

  const published = project.status === "published";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Edit project"
        title={project.title}
        actions={
          <>
            <Badge tone={published ? "success" : "warning"}>{published ? "Published" : "Draft"}</Badge>

            {published ? (
              <>
                <Link href={`/work/${project.slug}`} target="_blank" className={buttonStyles({ variant: "outline", size: "sm" })}>
                  View on site
                </Link>
                <ActionButton action={unpublishProjectAction} id={project.id} variant="outline" size="sm"
                  confirmMessage="Unpublish this project? It will also leave the homepage featured list.">
                  Unpublish
                </ActionButton>
              </>
            ) : (
              <ActionButton action={publishProjectAction} id={project.id} size="sm"
                disabled={!project.wistiaMediaId}
                title={project.wistiaMediaId ? undefined : "Sync the Wistia video first"}>
                Publish
              </ActionButton>
            )}
          </>
        }
      />

      {created && (
        <Notice tone="success">Project created. Check the video below, then publish when you are ready.</Notice>
      )}
      {syncWarning && (
        <Notice tone="warning">Project created, but the Wistia sync failed: {syncWarning}</Notice>
      )}

      <WistiaSyncStatus project={project} />

      <ProjectForm artists={artists} clients={clients} project={project} />
    </div>
  );
}