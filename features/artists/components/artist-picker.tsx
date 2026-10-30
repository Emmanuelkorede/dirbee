"use client";

import { OrderedPicker } from "@/components/admin/ordered-picker";
import type { Artist } from "@/types/database";

type ArtistPickerProps = {
  id?: string;
  artists: Artist[];
  value: string[];
  onChange: (ids: string[]) => void;
};

export function ArtistPicker({ artists, ...props }: ArtistPickerProps) {
  return (
    <OrderedPicker
      options={artists.map((artist) => ({ id: artist.id, label: artist.name }))}
      max={10}
      addLabel="Add an artist..."
      emptyText="No artist chosen yet. Every project needs at least one."
      {...props}
    />
  );
}