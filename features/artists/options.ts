import type { Artist } from "@/types/database";

type PersonKind = Artist["kind"];

const LABELS: Record<PersonKind, string> = {
  artist: "Artist",
  starring: "Starring",
};

export const PERSON_KIND_OPTIONS = (Object.keys(LABELS) as PersonKind[]).map((value) => ({
  value,
  label: LABELS[value],
}));

export function personKindLabel(kind: PersonKind) {
  return LABELS[kind];
}