import { sql } from "./index";

export async function createTables(): Promise<void> {
  try {
    // Create tags table
    await sql`
			CREATE TABLE IF NOT EXISTS tags (
				tag_id SERIAL PRIMARY KEY,
				tag_name VARCHAR(255) NOT NULL UNIQUE,
				tag_description TEXT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`;

    // Create tech_stack table
    await sql`
			CREATE TABLE IF NOT EXISTS tech_stack (
				tech_stack_id SERIAL PRIMARY KEY,
				tech_stack_name VARCHAR(255) NOT NULL UNIQUE,
				tech_stack_description TEXT,
				icon_url VARCHAR(500),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`;

    // Create services table
    await sql`
			CREATE TABLE IF NOT EXISTS services (
				service_id SERIAL PRIMARY KEY,
				service_name VARCHAR(255) NOT NULL UNIQUE,
				service_description TEXT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`;

    // Create projects table
    await sql`
			CREATE TABLE IF NOT EXISTS projects (
				id SERIAL PRIMARY KEY,
				title VARCHAR(255) NOT NULL,
				description TEXT,
				owner VARCHAR(255),
				url VARCHAR(500),
				category VARCHAR(50) NOT NULL,
				scope VARCHAR(50) NOT NULL,
				thumbnail VARCHAR(500),
				images TEXT[],
				featured BOOLEAN DEFAULT FALSE,
				tag_id INTEGER REFERENCES tags(tag_id),
				testimonial TEXT,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`;

    // Create project_tech_stack junction table (many-to-many)
    await sql`
			CREATE TABLE IF NOT EXISTS project_tech_stack (
				project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
				tech_stack_id INTEGER REFERENCES tech_stack(tech_stack_id) ON DELETE CASCADE,
				PRIMARY KEY (project_id, tech_stack_id)
			)
		`;

    // Create blogs table
    await sql`
			CREATE TABLE IF NOT EXISTS blogs (
				id SERIAL PRIMARY KEY,
				title VARCHAR(255) NOT NULL,
				author VARCHAR(255) NOT NULL,
				slug VARCHAR(255) NOT NULL UNIQUE,
				excerpt TEXT,
				thumbnail TEXT,
				content JSONB,
				time_read VARCHAR(50),
				tag_id INTEGER REFERENCES tags(tag_id),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`;

    // Create blog_like table
    await sql`
			CREATE TABLE IF NOT EXISTS blog_likes (
				id SERIAL PRIMARY KEY,
				blog_id INTEGER NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
				user_identifier VARCHAR(255) NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				UNIQUE(blog_id, user_identifier)
			)
		`;

    // Create client_information table
    await sql`
			CREATE TABLE IF NOT EXISTS client_information (
				id SERIAL PRIMARY KEY,
				nama_lengkap VARCHAR(255) NOT NULL,
				email VARCHAR(255) NOT NULL,
				no_whatsapp VARCHAR(20),
				instansi VARCHAR(255),
				civitas_itb BOOLEAN DEFAULT FALSE,
				jenis_proyek VARCHAR(255),
				tujuan_pembuatan_proyek TEXT,
				deskripsi_proyek TEXT,
				ekspetasi_biaya VARCHAR(100),
				deadline_proyek VARCHAR(100),
				sudah_memiliki_desain BOOLEAN DEFAULT FALSE,
				pertanyaan_untuk_proyek TEXT,
				dimana_mengetahui_iit VARCHAR(255),
				rating_website INTEGER CHECK (rating_website >= 1 AND rating_website <= 5),
				masukan_website TEXT,
				kode_promo VARCHAR(50),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`;

    // Create testimonials table
    await sql`
			CREATE TABLE IF NOT EXISTS testimonials (
				id SERIAL PRIMARY KEY,
				full_name VARCHAR(100) NOT NULL,
				role VARCHAR(100) NOT NULL,
				description VARCHAR(500) NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`;

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_tag_id ON projects(tag_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_project_tech_stack_project_id ON project_tech_stack(project_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_project_tech_stack_tech_stack_id ON project_tech_stack(tech_stack_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_blogs_tag_id ON blogs(tag_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_client_info_email ON client_information(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id)`;

    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}

export async function dropTables(): Promise<void> {
  try {
    await sql`DROP TABLE IF EXISTS testimonials CASCADE`;
    await sql`DROP TABLE IF EXISTS client_information CASCADE`;
    await sql`DROP TABLE IF EXISTS blogs CASCADE`;
    await sql`DROP TABLE IF EXISTS project_tech_stack CASCADE`;
    await sql`DROP TABLE IF EXISTS projects CASCADE`;
    await sql`DROP TABLE IF EXISTS services CASCADE`;
    await sql`DROP TABLE IF EXISTS tech_stack CASCADE`;
    await sql`DROP TABLE IF EXISTS tags CASCADE`;
    console.log("Database tables dropped successfully");
  } catch (error) {
    console.error("Error dropping tables:", error);
    throw error;
  }
}