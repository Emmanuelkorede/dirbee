import type { Project } from "@/types/database";

type ProjectType = Project["projectType"];

const LABELS: Record<ProjectType, string> = {
  visualizer: "Visualizer",
  artist_unveiling_video: "Artist Unveiling Video",
  content: "Content",
  performance_reel: "Performance Reel",
};

export const PROJECT_TYPE_OPTIONS = (Object.keys(LABELS) as ProjectType[]).map((value) => ({
  value,
  label: LABELS[value],
}));

export function projectTypeLabel(type: ProjectType) {
  return LABELS[type];
}