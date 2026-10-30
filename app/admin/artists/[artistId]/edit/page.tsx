import { notFound } from "next/navigation";

import { NameForm } from "@/components/admin/name-form";
import { PageHeader } from "@/components/ui/page-header";
import { updateArtistAction } from "@/features/artists/actions";
import { PERSON_KIND_OPTIONS } from "@/features/artists/options";
import { getArtistById } from "@/features/artists/queries";
import { requireAdmin } from "@/lib/auth/require-admin";

type Props = { params: Promise<{ artistId: string }> };

export default async function EditTalentPage({ params }: Props) {
  await requireAdmin();

  const { artistId } = await params;
  const person = await getArtistById(artistId);
  if (!person) notFound();

  return (
    <div className="space-y-8">
      <PageHeader title="Edit talent" />
      <NameForm
        action={updateArtistAction}
        id={person.id}
        defaultName={person.name}
        label="Name"
        listHref="/admin/artists"
        submitLabel="Save changes"
        hint="Renaming also changes the URL slug."
        kindOptions={PERSON_KIND_OPTIONS}
        defaultKind={person.kind}
        kindHint="The type cannot be changed while the person is on a project."
      />
    </div>
  );
}