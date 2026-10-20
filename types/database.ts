import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import {
  adminUsers,
  artists,
  clients,
  photoShoots,
  photos,
  projectArtists,
  projects,
  reviews,
  siteSettings,
} from "../db/schema";

export type Artist = InferSelectModel<typeof artists>;
export type NewArtist = InferInsertModel<typeof artists>;

export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;

export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;

export type ProjectArtist =
  InferSelectModel<typeof projectArtists>;

export type PhotoShoot = InferSelectModel<typeof photoShoots>;
export type NewPhotoShoot = InferInsertModel<typeof photoShoots>;

export type Photo = InferSelectModel<typeof photos>;
export type NewPhoto = InferInsertModel<typeof photos>;

export type Review = InferSelectModel<typeof reviews>;
export type NewReview = InferInsertModel<typeof reviews>;

export type SiteSettings =
  InferSelectModel<typeof siteSettings>;

export type AdminUser = InferSelectModel<typeof adminUsers>;