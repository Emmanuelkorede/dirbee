import Link from "next/link";

import { AdminTable, Td, Th, Tr } from "@/components/admin/admin-table";
import { ActionButton } from "@/components/ui/action-button";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { deleteArtistAction } from "@/features/artists/actions";
import { getArtistsWithProjectCount } from "@/features/artists/queries";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminArtistsPage() {
  await requireAdmin();
  const artists = await getArtistsWithProjectCount();

  const newLink = (
    <Link href="/admin/artists/new" className={buttonStyles()}>
      New artist
    </Link>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Artists"
        description="Create each artist once, then pick them on projects. An artist who is on a project cannot be deleted."
        actions={newLink}
      />

      {artists.length === 0 ? (
        <EmptyState title="No artists yet" description="Add your first artist." action={newLink} />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>URL slug</Th>
              <Th>Projects</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <Tr key={artist.id}>
                <Td className="font-medium">{artist.name}</Td>
                <Td className="text-muted-foreground">{artist.slug}</Td>
                <Td>{artist.projectCount}</Td>
                <Td>
                  <div className="flex items-start justify-end gap-2">
                    <Link href={`/admin/artists/${artist.id}/edit`} className={buttonStyles({ variant: "outline", size: "sm" })}>
                      Edit
                    </Link>
                    <ActionButton
                      action={deleteArtistAction}
                      id={artist.id}
                      variant="danger"
                      size="sm"
                      disabled={artist.projectCount > 0}
                      title={artist.projectCount > 0 ? "Remove this artist from their projects first" : undefined}
                      confirmMessage={`Delete "${artist.name}"?`}
                    >
                      Delete
                    </ActionButton>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}