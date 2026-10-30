"use client";

import { OrderedPicker } from "@/components/admin/ordered-picker";
import type { Artist } from "@/types/database";

type ArtistPickerProps = {
  id?: string;
  people: Artist[]; // already filtered to the right type
  kind: Artist["kind"];
  value: string[];
  onChange: (ids: string[]) => void;
};

export function ArtistPicker({ people, kind, ...props }: ArtistPickerProps) {
  const starring = kind === "starring";

  return (
    <OrderedPicker
      options={people.map((person) => ({ id: person.id, label: person.name }))}
      max={10}
      addLabel={starring ? "Add someone starring..." : "Add an artist..."}
      emptyText={
        starring
          ? "No one chosen yet. Every project needs at least one."
          : "No artist chosen yet. Every project needs at least one."
      }
      {...props}
    />
  );
}