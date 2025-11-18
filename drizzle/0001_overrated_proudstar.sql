ALTER TABLE "projects" DROP CONSTRAINT "projects_tag_id_tags_tag_id_fk";
--> statement-breakpoint
DROP INDEX "idx_projects_tag_id";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "tag_id";