
import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

// Enums
export const projectTypeEnum = pgEnum("project_type", [
  "visualizer",
  "artist_unveiling_video",
  "content",
  "performance_reel",
]);

export const publishStatusEnum = pgEnum("publish_status", [
  "draft",
  "published",
]);

export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "approved",
  "rejected",
]);

export const reviewSourceEnum = pgEnum("review_source", [
  "public_form",
  "admin",
]);

// Artists
export const artists = pgTable(
  "artists",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
);

// Clients
export const clients = pgTable(
  "clients",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
);

// Projects
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),

    // Optional client: a project can exist without a client.
    clientId: uuid("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),

    projectType: projectTypeEnum("project_type").notNull(),
    projectYear: smallint("project_year").notNull(),

    // Wistia share URL and actual media ID are different identifiers.
    // A draft can be saved before Wistia metadata sync succeeds.
    wistiaShareUrl: text("wistia_share_url"),
    wistiaMediaId: text("wistia_media_id").unique(),
    wistiaThumbnailUrl: text("wistia_thumbnail_url"),
    videoWidth: integer("video_width"),
    videoHeight: integer("video_height"),
    wistiaSyncedAt: timestamp("wistia_synced_at", {
      withTimezone: true,
    }),

    // Example: [{ label: "Director", value: "Bee" }]
    credits: jsonb("credits")
      .$type<Array<{ label: string; value: string }>>()
      .notNull()
      .default(sql`'[]'::jsonb`),

    isFeatured: boolean("is_featured").notNull().default(false),
    featuredOrder: smallint("featured_order"),
    status: publishStatusEnum("status").notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),

    publishedAt: timestamp("published_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    // A featured project must have a position from 1 to 10.
    check(
      "projects_featured_order_range",
      sql`${table.featuredOrder} IS NULL OR ${table.featuredOrder} BETWEEN 1 AND 10`,
    ),

    // Featured status and featured order must agree.
    check(
      "projects_featured_consistency",
      sql`${table.isFeatured} = (${table.featuredOrder} IS NOT NULL)`,
    ),

    // Only published projects require a resolved Wistia media ID.
    check(
      "projects_published_requires_wistia",
      sql`${table.status} <> 'published' OR ${table.wistiaMediaId} IS NOT NULL`,
    ),

    // Validate the actual Wistia media hashed ID, not the share-link slug.
    check(
      "projects_wistia_media_id_format",
      sql`${table.wistiaMediaId} IS NULL OR ${table.wistiaMediaId} ~ '^[a-zA-Z0-9]{10}$'`,
    ),

    check(
      "projects_video_width_positive",
      sql`${table.videoWidth} IS NULL OR ${table.videoWidth} > 0`,
    ),

    check(
      "projects_video_height_positive",
      sql`${table.videoHeight} IS NULL OR ${table.videoHeight} > 0`,
    ),

    check(
      "projects_published_at_required",
      sql`${table.status} <> 'published' OR ${table.publishedAt} IS NOT NULL`,
    ),

    check(
      "projects_year_range",
      sql`${table.projectYear} BETWEEN 1900 AND 2200`,
    ),

    index("projects_status_sort_idx").on(
      table.status,
      table.sortOrder,
    ),

    index("projects_status_featured_idx").on(
      table.status,
      table.isFeatured,
      table.featuredOrder,
    ),

    index("projects_client_id_idx").on(table.clientId),

    // At most one project can occupy each non-null featured position.
    uniqueIndex("projects_featured_order_unique")
      .on(table.featuredOrder)
      .where(sql`${table.featuredOrder} IS NOT NULL`),
  ],
);

// Project <-> Artist relationship
// A project can have multiple artists.
// An artist can appear in multiple projects.
// The composite primary key prevents attaching the same artist twice.
export const projectArtists = pgTable(
  "project_artists",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, {
        onDelete: "cascade",
      }),

    artistId: uuid("artist_id")
      .notNull()
      .references(() => artists.id, {
        onDelete: "restrict",
      }),

    // Controls artist display order on a project page.
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    primaryKey({
      name: "project_artists_pk",
      columns: [table.projectId, table.artistId],
    }),

    index("project_artists_artist_id_idx").on(
      table.artistId,
      table.sortOrder,
    ),
  ],
);

// Photography shoots
export const photoShoots = pgTable(
  "photo_shoots",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),

    status: publishStatusEnum("status").notNull().default("draft"),

    sortOrder: integer("sort_order").notNull().default(0),

    publishedAt: timestamp("published_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      "photo_shoots_published_at_required",
      sql`${table.status} <> 'published' OR ${table.publishedAt} IS NOT NULL`,
    ),

    index("photo_shoots_status_sort_idx").on(
      table.status,
      table.sortOrder,
    ),
  ],
);

// Photos
export const photos = pgTable(
  "photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    shootId: uuid("shoot_id")
      .notNull()
      .references(() => photoShoots.id, {
        onDelete: "restrict",
      }),

    // Cloudinary asset identifier, used for remote deletion.
    cloudinaryPublicId: text("cloudinary_public_id").notNull().unique(),

    imageUrl: text("image_url").notNull(),

    altText: text("alt_text").notNull(),
    caption: text("caption"),

    mimeType: text("mime_type"),
    sizeBytes: bigint("size_bytes", {
      mode: "number",
    }),

    width: integer("width"),
    height: integer("height"),

    displayOrder: integer("display_order").notNull().default(0),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      "photos_size_positive",
      sql`${table.sizeBytes} IS NULL OR ${table.sizeBytes} > 0`,
    ),

    check(
      "photos_width_positive",
      sql`${table.width} IS NULL OR ${table.width} > 0`,
    ),

    check(
      "photos_height_positive",
      sql`${table.height} IS NULL OR ${table.height} > 0`,
    ),

    index("photos_shoot_display_order_idx").on(
      table.shootId,
      table.displayOrder,
    ),
  ],
);


// Reviews 
export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    clientName: text("client_name").notNull(),
    email: text("email"),
    role: text("role"),
    company: text("company"),

    reviewText: text("review_text").notNull(),

    publicationConsent: boolean("publication_consent")
      .notNull()
      .default(false),

    status: reviewStatusEnum("status").notNull().default("pending"),

    isFeatured: boolean("is_featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),

    submissionSource: reviewSourceEnum("submission_source")
      .notNull()
      .default("public_form"),

    submittedAt: timestamp("submitted_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    approvedAt: timestamp("approved_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check(
      "reviews_featured_requires_approval",
      sql`NOT ${table.isFeatured} OR ${table.status} = 'approved'`,
    ),

    check(
      "reviews_approval_requires_consent",
      sql`${table.status} <> 'approved' OR ${table.publicationConsent} = true`,
    ),

    check(
      "reviews_approval_timestamp_required",
      sql`${table.status} <> 'approved' OR ${table.approvedAt} IS NOT NULL`,
    ),

    index("reviews_status_sort_idx").on(
      table.status,
      table.sortOrder,
    ),

    index("reviews_status_featured_idx").on(
      table.status,
      table.isFeatured,
      table.sortOrder,
    ),
  ],
);

// Site settings
// One row is intended: id = 1.
// The database check enforces the permitted ID; a seed script creates the row.

export const siteSettings = pgTable(
  "site_settings",
  {
    id: smallint("id").primaryKey().default(1),

    reviewsEnabled: boolean("reviews_enabled").notNull().default(true),

    showReviewsOnHomepage: boolean("show_reviews_on_homepage")
      .notNull()
      .default(true),

    contactEmail: text("contact_email"),

    instagramUrl: text("instagram_url"),
    tiktokUrl: text("tiktok_url"),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check("site_settings_singleton_id", sql`${table.id} = 1`),
  ],
);

// Admin authorization records
// This maps an identity from the chosen authentication provider to permission
// to use the admin area. It does not replace authentication itself.
export const adminUsers = pgTable("admin_users", {
  authUserId: text("auth_user_id").primaryKey(),

  email: text("email").notNull().unique(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

// Relations
export const artistsRelations = relations(artists, ({ many }) => ({
  projectArtists: many(projectArtists),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),

  projectArtists: many(projectArtists),
}));

export const projectArtistsRelations = relations(
  projectArtists,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectArtists.projectId],
      references: [projects.id],
    }),

    artist: one(artists, {
      fields: [projectArtists.artistId],
      references: [artists.id],
    }),
  }),
);

export const photoShootsRelations = relations(
  photoShoots,
  ({ many }) => ({
    photos: many(photos),
  }),
);

export const photosRelations = relations(photos, ({ one }) => ({
  shoot: one(photoShoots, {
    fields: [photos.shootId],
    references: [photoShoots.id],
  }),
}));
