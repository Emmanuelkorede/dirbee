import { PageHeader } from "@/components/ui/page-header";
import { ShootForm } from "@/features/photography/components/admin/shoot-form";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewPhotoShootPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <PageHeader title="New shoot" description="Create the gallery first, then add photos on the next page." />
      <ShootForm />
    </div>
  );
}