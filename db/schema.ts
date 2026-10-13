import { relations, sql } from "drizzle-orm";
import { 
  uuid, 
  text, 
  pgTable, 
  integer, 
  pgEnum, 
  timestamp, 
  boolean, 
  bigint, 
  smallint, 
  check, 
  index, 
  uniqueIndex  ,
  jsonb
} from "drizzle-orm/pg-core";

//  PostgreSQL Enums 
export const videoOrientation = pgEnum("video_orientation", ["portrait", "landscape"]);
export const publishStatus = pgEnum("publish_status", ["draft", "published"]);
export const reviewStatus = pgEnum("review_status", ["pending", "approved", "rejected"]);
export const reviewSource = pgEnum("review_source", ["public_form", "admin"]);

// Tables 
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  clientName: text("client_name"),
  projectYear: smallint("project_year"),
  wistiaShareUrl: text("wistia_share_url").notNull(),
  wistiaMediaId: text("wistia_media_id").notNull().unique(),
  wistiaThumbnailUrl: text("wistia_thumbnail_url"),
  credits: jsonb("credits")
  .$type<{ label: string; value: string }[]>()
  .notNull()
  .default([]),
  orientation: videoOrientation("orientation").notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  featuredOrder: smallint("featured_order"),
  status: publishStatus("status").notNull().default("draft"),
  sortOrder: integer("sort_order").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  check(
    "projects_featured_order_range",
    sql`${table.featuredOrder} IS NULL OR ${table.featuredOrder} BETWEEN 1 AND 10`
  ),
  check(
    "projects_featured_consistency",
    sql`${table.isFeatured} = (${table.featuredOrder} IS NOT NULL)`
  ),
  uniqueIndex("projects_featured_order_unique")
    .on(table.featuredOrder)
    .where(sql`${table.featuredOrder} IS NOT NULL`),
  index("projects_status_featured_idx")
    .on(table.status, table.isFeatured, table.featuredOrder),
]);

export const photoShoots = pgTable("photo_shoots", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  status: publishStatus("status").notNull().default("draft"),
  sortOrder: integer("sort_order").notNull().default(0),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("photo_shoots_status_sort_idx")
    .on(table.status, table.sortOrder),
]);

export const photos = pgTable("photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  shootId: uuid("shoot_id")
    .notNull()
    .references(() => photoShoots.id, { onDelete: "restrict" }),
  cloudinaryPublicId: text("cloudinary_public_id").notNull().unique(),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text").notNull(),
  caption: text("caption"),
  mimeType: text("mime_type").notNull(),
  sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
  widthPx: integer("width_px").notNull(),
  heightPx: integer("height_px").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index("photos_shoot_id_display_order_idx")
    .on(table.shootId, table.displayOrder),
]);

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email"),
  clientRole: text("client_role"),
  companyName: text("company_name"),
  reviewText: text("review_text").notNull(),
  publicationConsent: boolean("publication_consent").notNull().default(false),
  status: reviewStatus("status").notNull().default("pending"),
  isFeatured: boolean("is_featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  submissionSource: reviewSource("submission_source").notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  check(
    "reviews_featured_must_be_approved",
    sql`${table.isFeatured} = false OR ${table.status} = 'approved'`
  ),
  check(
    "reviews_approved_requires_consent",
    sql`${table.status} <> 'approved' OR ${table.publicationConsent} = true`
  ),
  index("reviews_status_sort_idx")
    .on(table.status, table.sortOrder),
  index("reviews_status_featured_idx")
    .on(table.status, table.isFeatured),
]);

export const siteSettings = pgTable("site_settings", {
  id: smallint("id").primaryKey(),
  reviewsEnabled: boolean("reviews_enabled").notNull().default(false),
  showReviewsOnHomepage: boolean("show_reviews_on_homepage").notNull().default(false),
  contactEmail: text("contact_email"),
  instagramUrl: text("instagram_url"),
  tiktokUrl: text("tiktok_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  check(
    "site_settings_singleton_check",
    sql`${table.id} = 1`
  ),
]);

export const adminUsers = pgTable("admin_users", {
  authUserId: text("auth_user_id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

//  Relations 
export const photoShootsRelations = relations(photoShoots, ({ many }) => ({
  photos: many(photos),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  photoShoot: one(photoShoots, {
    fields: [photos.shootId],
    references: [photoShoots.id],
  }),
}));