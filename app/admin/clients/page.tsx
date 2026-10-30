import Link from "next/link";

import { AdminTable, Td, Th, Tr } from "@/components/admin/admin-table";
import { ActionButton } from "@/components/ui/action-button";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { deleteClientAction } from "@/features/clients/actions";
import { getClientsWithProjectCount } from "@/features/clients/queries";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminClientsPage() {
  await requireAdmin();
  const clients = await getClientsWithProjectCount();

  const newLink = (
    <Link href="/admin/clients/new" className={buttonStyles()}>
      New client
    </Link>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Clients"
        description="Deleting a client does not delete its projects. The client is just removed from them."
        actions={newLink}
      />

      {clients.length === 0 ? (
        <EmptyState title="No clients yet" description="Clients are optional on projects." action={newLink} />
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
            {clients.map((client) => (
              <Tr key={client.id}>
                <Td className="font-medium">{client.name}</Td>
                <Td className="text-muted-foreground">{client.slug}</Td>
                <Td>{client.projectCount}</Td>
                <Td>
                  <div className="flex items-start justify-end gap-2">
                    <Link href={`/admin/clients/${client.id}/edit`} className={buttonStyles({ variant: "outline", size: "sm" })}>
                      Edit
                    </Link>
                    <ActionButton
                      action={deleteClientAction}
                      id={client.id}
                      variant="danger"
                      size="sm"
                      confirmMessage={
                        client.projectCount > 0
                          ? `Delete "${client.name}"? It will be removed from ${client.projectCount} project(s).`
                          : `Delete "${client.name}"?`
                      }
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