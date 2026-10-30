export const PROJECT_TYPES = [
  { value: "music-video", label: "Music Video" },
  { value: "visualizer", label: "Visualizer" },
  { value: "artist-unveiling", label: "Artist Unveiling" },
  { value: "content", label: "Content" },
  { value: "performance-reel", label: "Performance Reel" },
  { value: "other", label: "Other" },
] as const;


export const BUDGET_RANGES = [
  { value: "under-1k", label: "Under $1,000" },
  { value: "1k-3k", label: "$1,000 – $3,000" },
  { value: "3k-5k", label: "$3,000 – $5,000" },
  { value: "5k-10k", label: "$5,000 – $10,000" },
  { value: "10k-plus", label: "$10,000+" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

type Option = { value: string; label: string };

// Turns a saved value (like "music-video") into its label ("Music Video").
export function getLabel(options: readonly Option[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function isOneOf(options: readonly Option[], value: string) {
  return options.some((option) => option.value === value);
}