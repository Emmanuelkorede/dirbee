import { notFound } from "next/navigation";

import { NameForm } from "@/components/admin/name-form";
import { PageHeader } from "@/components/ui/page-header";
import { updateArtistAction } from "@/features/artists/actions";
import { getArtistById } from "@/features/artists/queries";
import { requireAdmin } from "@/lib/auth/require-admin";

type Props = { params: Promise<{ artistId: string }> };

export default async function EditArtistPage({ params }: Props) {
  await requireAdmin();

  const { artistId } = await params;
  const artist = await getArtistById(artistId);
  if (!artist) notFound();

  return (
    <div className="space-y-8">
      <PageHeader title="Edit artist" />
      <NameForm
        action={updateArtistAction}
        id={artist.id}
        defaultName={artist.name}
        label="Artist name"
        listHref="/admin/artists"
        submitLabel="Save changes"
        hint="Renaming also changes the artist's URL slug."
      />
    </div>
  );
}