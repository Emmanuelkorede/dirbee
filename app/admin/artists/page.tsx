import Link from "next/link";

import { AdminTable, Td, Th, Tr } from "@/components/admin/admin-table";
import { ActionButton } from "@/components/ui/action-button";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { deleteArtistAction } from "@/features/artists/actions";
import { personKindLabel } from "@/features/artists/options";
import { getArtistsWithProjectCount } from "@/features/artists/queries";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminTalentPage() {
  await requireAdmin();
  const people = await getArtistsWithProjectCount();

  const newLink = (
    <Link href="/admin/artists/new" className={buttonStyles()}>
      Add talent
    </Link>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Talent"
        description="Artists are used on music videos. Starring is used on Editorials / Fashion Film. Someone who is on a project cannot be deleted."
        actions={newLink}
      />

      {people.length === 0 ? (
        <EmptyState title="No talent yet" description="Add your first artist or starring." action={newLink} />
      ) : (
        <AdminTable>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>URL slug</Th>
              <Th>Projects</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <Tr key={person.id}>
                <Td className="font-medium">{person.name}</Td>
                <Td><Badge>{personKindLabel(person.kind)}</Badge></Td>
                <Td className="text-muted-foreground">{person.slug}</Td>
                <Td>{person.projectCount}</Td>
                <Td>
                  <div className="flex items-start justify-end gap-2">
                    <Link href={`/admin/artists/${person.id}/edit`} className={buttonStyles({ variant: "outline", size: "sm" })}>
                      Edit
                    </Link>
                    <ActionButton
                      action={deleteArtistAction}
                      id={person.id}
                      variant="danger"
                      size="sm"
                      disabled={person.projectCount > 0}
                      title={person.projectCount > 0 ? "Remove them from their projects first" : undefined}
                      confirmMessage={`Delete "${person.name}"?`}
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