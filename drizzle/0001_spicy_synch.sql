CREATE TYPE "public"."person_kind" AS ENUM('artist', 'starring');--> statement-breakpoint
ALTER TYPE "public"."project_type" ADD VALUE 'editorials / fashion_film';--> statement-breakpoint
CREATE TABLE "project_clients" (
	"project_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "project_clients_pk" PRIMARY KEY("project_id","client_id")
);
--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_client_id_clients_id_fk";
--> statement-breakpoint
DROP INDEX "projects_client_id_idx";--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "artists" ADD COLUMN "kind" "person_kind" DEFAULT 'artist' NOT NULL;--> statement-breakpoint
ALTER TABLE "project_clients" ADD CONSTRAINT "project_clients_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_clients" ADD CONSTRAINT "project_clients_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_clients_client_id_idx" ON "project_clients" USING btree ("client_id");--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "client_id";