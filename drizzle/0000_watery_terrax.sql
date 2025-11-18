CREATE TABLE "blog_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"blog_id" integer NOT NULL,
	"user_identifier" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"thumbnail" text,
	"content" text,
	"time_read" varchar(50),
	"tag_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "client_information" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama_lengkap" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"no_whatsapp" varchar(20),
	"instansi" varchar(255),
	"civitas_itb" boolean DEFAULT false,
	"jenis_proyek" varchar(255),
	"tujuan_pembuatan_proyek" text,
	"deskripsi_proyek" text,
	"ekspetasi_biaya" varchar(100),
	"deadline_proyek" varchar(100),
	"sudah_memiliki_desain" boolean DEFAULT false,
	"pertanyaan_untuk_proyek" text,
	"dimana_mengetahui_iit" varchar(255),
	"rating_website" integer,
	"masukan_website" text,
	"kode_promo" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_tech_stack" (
	"project_id" integer NOT NULL,
	"tech_stack_id" integer NOT NULL,
	CONSTRAINT "project_tech_stack_project_id_tech_stack_id_pk" PRIMARY KEY("project_id","tech_stack_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"owner" varchar(255),
	"url" varchar(500),
	"category" varchar(50) NOT NULL,
	"scope" varchar(50) NOT NULL,
	"thumbnail" text,
	"images" text[],
	"featured" boolean DEFAULT false,
	"tag_id" integer,
	"testimonial" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"service_id" serial PRIMARY KEY NOT NULL,
	"service_name" varchar(255) NOT NULL,
	"service_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_service_name_unique" UNIQUE("service_name")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"tag_id" serial PRIMARY KEY NOT NULL,
	"tag_name" varchar(255) NOT NULL,
	"tag_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_tag_name_unique" UNIQUE("tag_name")
);
--> statement-breakpoint
CREATE TABLE "tech_stack" (
	"tech_stack_id" serial PRIMARY KEY NOT NULL,
	"tech_stack_name" varchar(255) NOT NULL,
	"tech_stack_description" text,
	"icon_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tech_stack_tech_stack_name_unique" UNIQUE("tech_stack_name")
);
--> statement-breakpoint
ALTER TABLE "blog_likes" ADD CONSTRAINT "blog_likes_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_tag_id_tags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("tag_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tech_stack" ADD CONSTRAINT "project_tech_stack_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tech_stack" ADD CONSTRAINT "project_tech_stack_tech_stack_id_tech_stack_tech_stack_id_fk" FOREIGN KEY ("tech_stack_id") REFERENCES "public"."tech_stack"("tech_stack_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_tag_id_tags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("tag_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_blog_likes_blog_id" ON "blog_likes" USING btree ("blog_id");--> statement-breakpoint
CREATE INDEX "unique_blog_like" ON "blog_likes" USING btree ("blog_id","user_identifier");--> statement-breakpoint
CREATE INDEX "idx_blogs_tag_id" ON "blogs" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "idx_blogs_slug" ON "blogs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_client_info_email" ON "client_information" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_project_tech_stack_project_id" ON "project_tech_stack" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "idx_project_tech_stack_tech_stack_id" ON "project_tech_stack" USING btree ("tech_stack_id");--> statement-breakpoint
CREATE INDEX "idx_projects_tag_id" ON "projects" USING btree ("tag_id");