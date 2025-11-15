// import { sql } from "./index";

// export async function createTables(): Promise<void> {
//   try {
//     // Create tags table
//     await sql`
// 			CREATE TABLE IF NOT EXISTS tags (
// 				tag_id SERIAL PRIMARY KEY,
// 				tag_name VARCHAR(255) NOT NULL UNIQUE,
// 				tag_description TEXT,
// 				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// 				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// 			)
// 		`;

//     // Create tech_stack table
//     await sql`
// 			CREATE TABLE IF NOT EXISTS tech_stack (
// 				tech_stack_id SERIAL PRIMARY KEY,
// 				tech_stack_name VARCHAR(255) NOT NULL UNIQUE,
// 				tech_stack_description TEXT,
// 				icon_url VARCHAR(500),
// 				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// 				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// 			)
// 		`;

//     // Create services table
//     await sql`
// 			CREATE TABLE IF NOT EXISTS services (
// 				service_id SERIAL PRIMARY KEY,
// 				service_name VARCHAR(255) NOT NULL UNIQUE,
// 				service_description TEXT,
// 				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// 				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// 			)
// 		`;

//     // Create projects table
//     await sql`
// 			CREATE TABLE IF NOT EXISTS projects (
// 				id SERIAL PRIMARY KEY,
// 				title VARCHAR(255) NOT NULL,
// 				description TEXT,
// 				owner VARCHAR(255),
// 				url VARCHAR(500),
// 				category VARCHAR(50) NOT NULL,
// 				scope VARCHAR(50) NOT NULL,
// 				thumbnail VARCHAR(500),
// 				images TEXT[],
// 				featured BOOLEAN DEFAULT FALSE,
// 				tag_id INTEGER REFERENCES tags(tag_id),
// 				testimonial TEXT,
// 				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// 				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// 			)
// 		`;

//     // Create project_tech_stack junction table (many-to-many)
//     await sql`
// 			CREATE TABLE IF NOT EXISTS project_tech_stack (
// 				project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
// 				tech_stack_id INTEGER REFERENCES tech_stack(tech_stack_id) ON DELETE CASCADE,
// 				PRIMARY KEY (project_id, tech_stack_id)
// 			)
// 		`;

//     // Create blogs table
//     await sql`
// 			CREATE TABLE IF NOT EXISTS blogs (
// 				id SERIAL PRIMARY KEY,
// 				title VARCHAR(255) NOT NULL,
// 				author VARCHAR(255) NOT NULL,
// 				slug VARCHAR(255) NOT NULL UNIQUE,
// 				excerpt TEXT,
// 				thumbnail VARCHAR(500),
// 				content TEXT,
// 				tag_id INTEGER REFERENCES tags(tag_id),
// 				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// 				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// 			)
// 		`;

//     // Create blog_like table
//     await sql`
// 			CREATE TABLE IF NOT EXISTS blog_likes (
// 				id SERIAL PRIMARY KEY,
// 				blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
// 				user_identifier VARCHAR(255) NOT NULL,
// 				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// 				UNIQUE(blog_id, user_identifier)
// 			)
// 		`;

//     // Create client_information table
//     await sql`
// 			CREATE TABLE IF NOT EXISTS client_information (
// 				id SERIAL PRIMARY KEY,
// 				nama_lengkap VARCHAR(255) NOT NULL,
// 				email VARCHAR(255) NOT NULL,
// 				no_whatsapp VARCHAR(20),
// 				instansi VARCHAR(255),
// 				civitas_itb BOOLEAN DEFAULT FALSE,
// 				jenis_proyek VARCHAR(255),
// 				tujuan_pembuatan_proyek TEXT,
// 				deskripsi_proyek TEXT,
// 				ekspetasi_biaya VARCHAR(100),
// 				deadline_proyek VARCHAR(100),
// 				sudah_memiliki_desain BOOLEAN DEFAULT FALSE,
// 				pertanyaan_untuk_proyek TEXT,
// 				dimana_mengetahui_iit VARCHAR(255),
// 				rating_website INTEGER CHECK (rating_website >= 1 AND rating_website <= 5),
// 				masukan_website TEXT,
// 				kode_promo VARCHAR(50),
// 				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// 				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// 			)
// 		`;

//     // Create indexes for better performance
//     await sql`CREATE INDEX IF NOT EXISTS idx_projects_tag_id ON projects(tag_id)`;
//     await sql`CREATE INDEX IF NOT EXISTS idx_project_tech_stack_project_id ON project_tech_stack(project_id)`;
//     await sql`CREATE INDEX IF NOT EXISTS idx_project_tech_stack_tech_stack_id ON project_tech_stack(tech_stack_id)`;
//     await sql`CREATE INDEX IF NOT EXISTS idx_blogs_tag_id ON blogs(tag_id)`;
//     await sql`CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug)`;
//     await sql`CREATE INDEX IF NOT EXISTS idx_client_info_email ON client_information(email)`;
//     await sql`CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id)`;

//     console.log("Database tables created successfully");
//   } catch (error) {
//     console.error("Error creating tables:", error);
//     throw error;
//   }
// }

// export async function dropTables(): Promise<void> {
//   try {
//     await sql`DROP TABLE IF EXISTS client_information CASCADE`;
//     await sql`DROP TABLE IF EXISTS blogs CASCADE`;
//     await sql`DROP TABLE IF EXISTS project_tech_stack CASCADE`;
//     await sql`DROP TABLE IF EXISTS projects CASCADE`;
//     await sql`DROP TABLE IF EXISTS services CASCADE`;
//     await sql`DROP TABLE IF EXISTS tech_stack CASCADE`;
//     await sql`DROP TABLE IF EXISTS tags CASCADE`;
//     console.log("Database tables dropped successfully");
//   } catch (error) {
//     console.error("Error dropping tables:", error);
//     throw error;
//   }
// }

import { pgTable, serial, varchar, text, timestamp, boolean, integer, primaryKey, index } from "drizzle-orm/pg-core";
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
  tech_stack_name: varchar("tech_stack_name", { length: 255 }).notNull().unique(),
  tech_stack_description: text("tech_stack_description"),
  icon_url: varchar("icon_url", { length: 500 }),
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

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  owner: varchar("owner", { length: 255 }),
  url: varchar("url", { length: 500 }),
  category: varchar("category", { length: 50 }).notNull(),
  scope: varchar("scope", { length: 50 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  images: text("images").array(),
  featured: boolean("featured").default(false),
  tag_id: integer("tag_id").references(() => tags.tag_id),
  testimonial: text("testimonial"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tagIdIdx: index("idx_projects_tag_id").on(table.tag_id),
}));

export const projectTechStack = pgTable("project_tech_stack", {
  project_id: integer("project_id").references(() => projects.id, { onDelete: "cascade" }).notNull(),
  tech_stack_id: integer("tech_stack_id").references(() => techStack.tech_stack_id, { onDelete: "cascade" }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.project_id, table.tech_stack_id] }),
  projectIdIdx: index("idx_project_tech_stack_project_id").on(table.project_id),
  techStackIdIdx: index("idx_project_tech_stack_tech_stack_id").on(table.tech_stack_id),
}));

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  thumbnail: varchar("thumbnail", { length: 500 }),
  content: text("content"),
  time_read: varchar("time_read", { length: 50 }),
  tag_id: integer("tag_id").references(() => tags.tag_id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tagIdIdx: index("idx_blogs_tag_id").on(table.tag_id),
  slugIdx: index("idx_blogs_slug").on(table.slug),
}));

export const blogLikes = pgTable("blog_likes", {
  id: serial("id").primaryKey(),
  blog_id: integer("blog_id").references(() => blogs.id, { onDelete: "cascade" }).notNull(),
  user_identifier: varchar("user_identifier", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  blogIdIdx: index("idx_blog_likes_blog_id").on(table.blog_id),
  uniqueLike: index("unique_blog_like").on(table.blog_id, table.user_identifier),
}));

export const clientInformation = pgTable("client_information", {
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
}, (table) => ({
  emailIdx: index("idx_client_info_email").on(table.email),
}));


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

export const projectTechStackRelations = relations(projectTechStack, ({ one }) => ({
  project: one(projects, {
    fields: [projectTechStack.project_id],
    references: [projects.id],
  }),
  techStack: one(techStack, {
    fields: [projectTechStack.tech_stack_id],
    references: [techStack.tech_stack_id],
  }),
}));

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