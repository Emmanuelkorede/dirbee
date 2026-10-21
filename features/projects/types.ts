import type { z } from "zod";

import type { Artist, Client, Project , NewProject } from "@/types/database";
import type { projectInputSchema } from "./validation";

export type ProjectInput = z.infer<typeof projectInputSchema>;

export type ProjectWithArtists = Project & { artists: Artist[] };

export type ProjectDetail = ProjectWithArtists & { client: Client | null };

export type WistiaColumns = Pick<
  NewProject,
  | "wistiaShareUrl"
  | "wistiaMediaId"
  | "wistiaThumbnailUrl"
  | "videoWidth"
  | "videoHeight"
  | "wistiaSyncedAt"
>;