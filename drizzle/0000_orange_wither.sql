CREATE TYPE "public"."project_type" AS ENUM('visualizer', 'artist_unveiling_video', 'content', 'performance_reel');--> statement-breakpoint
CREATE TYPE "public"."publish_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."review_source" AS ENUM('public_form', 'admin');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"auth_user_id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "artists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artists_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clients_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "photo_shoots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "photo_shoots_slug_unique" UNIQUE("slug"),
	CONSTRAINT "photo_shoots_published_at_required" CHECK ("photo_shoots"."status" <> 'published' OR "photo_shoots"."published_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shoot_id" uuid NOT NULL,
	"cloudinary_public_id" text NOT NULL,
	"image_url" text NOT NULL,
	"alt_text" text NOT NULL,
	"caption" text,
	"mime_type" text,
	"size_bytes" bigint,
	"width" integer,
	"height" integer,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "photos_cloudinary_public_id_unique" UNIQUE("cloudinary_public_id"),
	CONSTRAINT "photos_size_positive" CHECK ("photos"."size_bytes" IS NULL OR "photos"."size_bytes" > 0),
	CONSTRAINT "photos_width_positive" CHECK ("photos"."width" IS NULL OR "photos"."width" > 0),
	CONSTRAINT "photos_height_positive" CHECK ("photos"."height" IS NULL OR "photos"."height" > 0)
);
--> statement-breakpoint
CREATE TABLE "project_artists" (
	"project_id" uuid NOT NULL,
	"artist_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "project_artists_pk" PRIMARY KEY("project_id","artist_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"client_id" uuid,
	"project_type" "project_type" NOT NULL,
	"project_year" smallint NOT NULL,
	"wistia_share_url" text,
	"wistia_media_id" text,
	"wistia_thumbnail_url" text,
	"video_width" integer,
	"video_height" integer,
	"wistia_synced_at" timestamp with time zone,
	"credits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"featured_order" smallint,
	"status" "publish_status" DEFAULT 'draft' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug"),
	CONSTRAINT "projects_wistia_media_id_unique" UNIQUE("wistia_media_id"),
	CONSTRAINT "projects_featured_order_range" CHECK ("projects"."featured_order" IS NULL OR "projects"."featured_order" BETWEEN 1 AND 10),
	CONSTRAINT "projects_featured_consistency" CHECK ("projects"."is_featured" = ("projects"."featured_order" IS NOT NULL)),
	CONSTRAINT "projects_published_requires_wistia" CHECK ("projects"."status" <> 'published' OR "projects"."wistia_media_id" IS NOT NULL),
	CONSTRAINT "projects_wistia_media_id_format" CHECK ("projects"."wistia_media_id" IS NULL OR "projects"."wistia_media_id" ~ '^[a-zA-Z0-9]{10}$'),
	CONSTRAINT "projects_video_width_positive" CHECK ("projects"."video_width" IS NULL OR "projects"."video_width" > 0),
	CONSTRAINT "projects_video_height_positive" CHECK ("projects"."video_height" IS NULL OR "projects"."video_height" > 0),
	CONSTRAINT "projects_published_at_required" CHECK ("projects"."status" <> 'published' OR "projects"."published_at" IS NOT NULL),
	CONSTRAINT "projects_year_range" CHECK ("projects"."project_year" BETWEEN 1900 AND 2200)
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_name" text NOT NULL,
	"email" text,
	"role" text,
	"company" text,
	"review_text" text NOT NULL,
	"publication_consent" boolean DEFAULT false NOT NULL,
	"status" "review_status" DEFAULT 'pending' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"submission_source" "review_source" DEFAULT 'public_form' NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_featured_requires_approval" CHECK (NOT "reviews"."is_featured" OR "reviews"."status" = 'approved'),
	CONSTRAINT "reviews_approval_requires_consent" CHECK ("reviews"."status" <> 'approved' OR "reviews"."publication_consent" = true),
	CONSTRAINT "reviews_approval_timestamp_required" CHECK ("reviews"."status" <> 'approved' OR "reviews"."approved_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" smallint PRIMARY KEY DEFAULT 1 NOT NULL,
	"reviews_enabled" boolean DEFAULT true NOT NULL,
	"show_reviews_on_homepage" boolean DEFAULT true NOT NULL,
	"contact_email" text,
	"instagram_url" text,
	"tiktok_url" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_singleton_id" CHECK ("site_settings"."id" = 1)
);
--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_shoot_id_photo_shoots_id_fk" FOREIGN KEY ("shoot_id") REFERENCES "public"."photo_shoots"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_artists" ADD CONSTRAINT "project_artists_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_artists" ADD CONSTRAINT "project_artists_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "photo_shoots_status_sort_idx" ON "photo_shoots" USING btree ("status","sort_order");--> statement-breakpoint
CREATE INDEX "photos_shoot_display_order_idx" ON "photos" USING btree ("shoot_id","display_order");--> statement-breakpoint
CREATE INDEX "project_artists_artist_id_idx" ON "project_artists" USING btree ("artist_id","sort_order");--> statement-breakpoint
CREATE INDEX "projects_status_sort_idx" ON "projects" USING btree ("status","sort_order");--> statement-breakpoint
CREATE INDEX "projects_status_featured_idx" ON "projects" USING btree ("status","is_featured","featured_order");--> statement-breakpoint
CREATE INDEX "projects_client_id_idx" ON "projects" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_featured_order_unique" ON "projects" USING btree ("featured_order") WHERE "projects"."featured_order" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "reviews_status_sort_idx" ON "reviews" USING btree ("status","sort_order");--> statement-breakpoint
CREATE INDEX "reviews_status_featured_idx" ON "reviews" USING btree ("status","is_featured","sort_order");