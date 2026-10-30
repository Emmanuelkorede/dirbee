import { notFound } from "next/navigation";

import { NameForm } from "@/components/admin/name-form";
import { PageHeader } from "@/components/ui/page-header";
import { updateClientAction } from "@/features/clients/actions";
import { getClientById } from "@/features/clients/queries";
import { requireAdmin } from "@/lib/auth/require-admin";

type Props = { params: Promise<{ clientId: string }> };

export default async function EditClientPage({ params }: Props) {
  await requireAdmin();

  const { clientId } = await params;
  const client = await getClientById(clientId);
  if (!client) notFound();

  return (
    <div className="space-y-8">
      <PageHeader title="Edit client" />
      <NameForm
        action={updateClientAction}
        id={client.id}
        defaultName={client.name}
        label="Client name"
        listHref="/admin/clients"
        submitLabel="Save changes"
        hint="Renaming also changes the client's URL slug."
      />
    </div>
  );
}