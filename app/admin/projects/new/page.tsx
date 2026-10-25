import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getArtists } from "@/features/artists/queries";
import { getClients } from "@/features/clients/queries";
import { ProjectForm } from "@/features/projects/components/admin/project-form";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewProjectPage() {
  await requireAdmin();
  const [artists, clients] = await Promise.all([getArtists(), getClients()]);

  return (
    <div className="space-y-8">
      <PageHeader title="New project" />

      {artists.length === 0 ? (
        <EmptyState
          title="Create an artist first"
          description="Every project needs at least one artist."
          action={<Link href="/admin/artists/new" className={buttonStyles()}>New artist</Link>}
        />
      ) : (
        <ProjectForm artists={artists} clients={clients} />
      )}
    </div>
  );
}