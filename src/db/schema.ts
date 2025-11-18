import {
	pgTable,
	serial,
	varchar,
	text,
	timestamp,
	boolean,
	integer,
	primaryKey,
	index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const tags = pgTable("tags", {
	tag_id: serial("tag_id").primaryKey(),
	tag_name: varchar("tag_name", { length: 255 }).notNull().unique(),
	tag_description: text("tag_description"),
	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const techStack = pgTable("tech_stack", {
	tech_stack_id: serial("tech_stack_id").primaryKey(),
	tech_stack_name: varchar("tech_stack_name", { length: 255 })
		.notNull()
		.unique(),
	tech_stack_description: text("tech_stack_description"),
	icon_url: text("icon_url"),
	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
	service_id: serial("service_id").primaryKey(),
	service_name: varchar("service_name", { length: 255 }).notNull().unique(),
	service_description: text("service_description"),
	created_at: timestamp("created_at").defaultNow().notNull(),
	updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const projects = pgTable(
	"projects",
	{
		id: serial("id").primaryKey(),
		title: varchar("title", { length: 255 }).notNull(),
		description: text("description"),
		owner: varchar("owner", { length: 255 }),
		url: varchar("url", { length: 500 }),
		category: varchar("category", { length: 50 }).notNull(),
		scope: varchar("scope", { length: 50 }).notNull(),
		thumbnail: text("thumbnail"),
		images: text("images").array(),
		featured: boolean("featured").default(false),
		tag_id: integer("tag_id").references(() => tags.tag_id),
		testimonial: text("testimonial"),
		created_at: timestamp("created_at").defaultNow().notNull(),
		updated_at: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => ({
		tagIdIdx: index("idx_projects_tag_id").on(table.tag_id),
	}),
);

export const projectTechStack = pgTable(
	"project_tech_stack",
	{
		project_id: integer("project_id")
			.references(() => projects.id, { onDelete: "cascade" })
			.notNull(),
		tech_stack_id: integer("tech_stack_id")
			.references(() => techStack.tech_stack_id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.project_id, table.tech_stack_id] }),
		projectIdIdx: index("idx_project_tech_stack_project_id").on(
			table.project_id,
		),
		techStackIdIdx: index("idx_project_tech_stack_tech_stack_id").on(
			table.tech_stack_id,
		),
	}),
);

export const blogs = pgTable(
	"blogs",
	{
		id: serial("id").primaryKey(),
		title: varchar("title", { length: 255 }).notNull(),
		author: varchar("author", { length: 255 }).notNull(),
		slug: varchar("slug", { length: 255 }).notNull().unique(),
		excerpt: text("excerpt"),
		thumbnail: text("thumbnail"),
		content: text("content"),
		time_read: varchar("time_read", { length: 50 }),
		tag_id: integer("tag_id").references(() => tags.tag_id),
		created_at: timestamp("created_at").defaultNow().notNull(),
		updated_at: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => ({
		tagIdIdx: index("idx_blogs_tag_id").on(table.tag_id),
		slugIdx: index("idx_blogs_slug").on(table.slug),
	}),
);

export const blogLikes = pgTable(
	"blog_likes",
	{
		id: serial("id").primaryKey(),
		blog_id: integer("blog_id")
			.references(() => blogs.id, { onDelete: "cascade" })
			.notNull(),
		user_identifier: varchar("user_identifier", { length: 255 }).notNull(),
		created_at: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		blogIdIdx: index("idx_blog_likes_blog_id").on(table.blog_id),
		uniqueLike: index("unique_blog_like").on(
			table.blog_id,
			table.user_identifier,
		),
	}),
);

export const clientInformation = pgTable(
	"client_information",
	{
		id: serial("id").primaryKey(),
		nama_lengkap: varchar("nama_lengkap", { length: 255 }).notNull(),
		email: varchar("email", { length: 255 }).notNull(),
		no_whatsapp: varchar("no_whatsapp", { length: 20 }),
		instansi: varchar("instansi", { length: 255 }),
		civitas_itb: boolean("civitas_itb").default(false),
		jenis_proyek: varchar("jenis_proyek", { length: 255 }),
		tujuan_pembuatan_proyek: text("tujuan_pembuatan_proyek"),
		deskripsi_proyek: text("deskripsi_proyek"),
		ekspetasi_biaya: varchar("ekspetasi_biaya", { length: 100 }),
		deadline_proyek: varchar("deadline_proyek", { length: 100 }),
		sudah_memiliki_desain: boolean("sudah_memiliki_desain").default(false),
		pertanyaan_untuk_proyek: text("pertanyaan_untuk_proyek"),
		dimana_mengetahui_iit: varchar("dimana_mengetahui_iit", { length: 255 }),
		rating_website: integer("rating_website"),
		masukan_website: text("masukan_website"),
		kode_promo: varchar("kode_promo", { length: 50 }),
		created_at: timestamp("created_at").defaultNow().notNull(),
		updated_at: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => ({
		emailIdx: index("idx_client_info_email").on(table.email),
	}),
);

export const tagsRelations = relations(tags, ({ many }) => ({
	projects: many(projects),
	blogs: many(blogs),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
	tag: one(tags, {
		fields: [projects.tag_id],
		references: [tags.tag_id],
	}),
	techStacks: many(projectTechStack),
}));

export const techStackRelations = relations(techStack, ({ many }) => ({
	projects: many(projectTechStack),
}));

export const projectTechStackRelations = relations(
	projectTechStack,
	({ one }) => ({
		project: one(projects, {
			fields: [projectTechStack.project_id],
			references: [projects.id],
		}),
		techStack: one(techStack, {
			fields: [projectTechStack.tech_stack_id],
			references: [techStack.tech_stack_id],
		}),
	}),
);

export const blogsRelations = relations(blogs, ({ one, many }) => ({
	tag: one(tags, {
		fields: [blogs.tag_id],
		references: [tags.tag_id],
	}),
	likes: many(blogLikes),
}));

export const blogLikesRelations = relations(blogLikes, ({ one }) => ({
	blog: one(blogs, {
		fields: [blogLikes.blog_id],
		references: [blogs.id],
	}),
}));
