import type { Artist, Project } from "@/types/database";

type ProjectType = Project["projectType"];
type PersonKind = Artist["kind"];

// The exact value stored in the database for editorials and fashion films.
export const EDITORIAL_TYPE = "editorials / fashion_film" as const;

// TypeScript fails here if the database ever gains a type that is missing from this list.
const LABELS: Record<ProjectType, string> = {
  visualizer: "Visualizer",
  artist_unveiling_video: "Artist Unveiling Video",
  content: "Content",
  performance_reel: "Performance Reel",
  "editorials / fashion_film": "Editorials / Fashion Film",
};

export const PROJECT_TYPE_OPTIONS = (Object.keys(LABELS) as ProjectType[]).map((value) => ({
  value,
  label: LABELS[value],
}));

export function projectTypeLabel(type: ProjectType) {
  return LABELS[type];
}


export type WorkGroup = "editorial" | "music_video";

export function projectGroup(type: ProjectType): WorkGroup {
  return type === EDITORIAL_TYPE ? "editorial" : "music_video";
}

export const WORK_FILTERS = [
  { key: "all", label: "All" },
  { key: "editorial", label: "Editorials / Fashion Film" },
  { key: "music_video", label: "Music Video" },
] as const;

export type WorkFilter = (typeof WORK_FILTERS)[number]["key"];

// Editorials / fashion film use "Starring" people. Everything else uses "Artist" people.
export function personKindFor(type: ProjectType): PersonKind {
  return projectGroup(type) === "editorial" ? "starring" : "artist";
}

// Several people on one project are joined with x: "Emmanuel x Blessing".
export function formatArtistNames(people: { name: string }[]) {
  return people.map((person) => person.name).join(" x ");
}