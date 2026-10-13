CREATE TYPE "public"."publish_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."review_source" AS ENUM('public_form', 'admin');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."video_orientation" AS ENUM('portrait', 'landscape');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"auth_user_id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
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
	CONSTRAINT "photo_shoots_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shoot_id" uuid NOT NULL,
	"cloudinary_public_id" text NOT NULL,
	"image_url" text NOT NULL,
	"alt_text" text NOT NULL,
	"caption" text,
	"mime_type" text NOT NULL,
	"size_bytes" bigint NOT NULL,
	"width_px" integer NOT NULL,
	"height_px" integer NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "photos_cloudinary_public_id_unique" UNIQUE("cloudinary_public_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"client_name" text,
	"project_year" smallint,
	"wistia_share_url" text NOT NULL,
	"wistia_media_id" text NOT NULL,
	"wistia_thumbnail_url" text,
	"credits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"orientation" "video_orientation" NOT NULL,
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
	CONSTRAINT "projects_featured_consistency" CHECK ("projects"."is_featured" = ("projects"."featured_order" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_name" text NOT NULL,
	"client_email" text,
	"client_role" text,
	"company_name" text,
	"review_text" text NOT NULL,
	"publication_consent" boolean DEFAULT false NOT NULL,
	"status" "review_status" DEFAULT 'pending' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"submission_source" "review_source" NOT NULL,
	"submitted_at" timestamp with time zone,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_featured_must_be_approved" CHECK ("reviews"."is_featured" = false OR "reviews"."status" = 'approved'),
	CONSTRAINT "reviews_approved_requires_consent" CHECK ("reviews"."status" <> 'approved' OR "reviews"."publication_consent" = true)
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" smallint PRIMARY KEY NOT NULL,
	"reviews_enabled" boolean DEFAULT false NOT NULL,
	"show_reviews_on_homepage" boolean DEFAULT false NOT NULL,
	"contact_email" text,
	"instagram_url" text,
	"tiktok_url" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_singleton_check" CHECK ("site_settings"."id" = 1)
);
--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_shoot_id_photo_shoots_id_fk" FOREIGN KEY ("shoot_id") REFERENCES "public"."photo_shoots"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "photo_shoots_status_sort_idx" ON "photo_shoots" USING btree ("status","sort_order");--> statement-breakpoint
CREATE INDEX "photos_shoot_id_display_order_idx" ON "photos" USING btree ("shoot_id","display_order");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_featured_order_unique" ON "projects" USING btree ("featured_order") WHERE "projects"."featured_order" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "projects_status_featured_idx" ON "projects" USING btree ("status","is_featured","featured_order");--> statement-breakpoint
CREATE INDEX "reviews_status_sort_idx" ON "reviews" USING btree ("status","sort_order");--> statement-breakpoint
CREATE INDEX "reviews_status_featured_idx" ON "reviews" USING btree ("status","is_featured");