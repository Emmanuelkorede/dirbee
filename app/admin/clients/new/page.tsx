import { NameForm } from "@/components/admin/name-form";
import { PageHeader } from "@/components/ui/page-header";
import { createClientAction } from "@/features/clients/actions";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewClientPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <PageHeader title="New client" />
      <NameForm
        action={createClientAction}
        label="Client name"
        listHref="/admin/clients"
        submitLabel="Create client"
        hint="Record labels, management companies or brands."
      />
    </div>
  );
}