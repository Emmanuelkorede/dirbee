export const PROJECT_TYPES = [
  { value: "music-video", label: "Music Video" },
  { value: "visualizer", label: "Visualizer" },
  { value: "artist-unveiling", label: "Artist Unveiling" },
  { value: "content", label: "Content" },
  { value: "performance-reel", label: "Performance Reel" },
  { value: "editorial-fashion", label: "Editorial/ Fashion film" },
  { value: "other", label: "Other" },
] as const;


export const BUDGET_RANGES = [
  { value: "under-1.5m", label: "Under ₦1,500,000" },
  { value: "1.5m-4.5m", label: "₦1,500,000 – ₦4,500,000" },
  { value: "4.5m-7.5m", label: "₦4,500,000 – ₦7,500,000" },
  { value: "7.5m-15m", label: "₦7,500,000 – ₦15,000,000" },
  { value: "15m-plus", label: "₦15,000,000+" },
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