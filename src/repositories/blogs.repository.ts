import { sql } from "../db";
import type { Blog, CreateBlogRequest } from "../types";

export class BlogsRepository {
	static async findAll(): Promise<Blog[]> {
		return await sql<Blog[]>`
			SELECT 
				b.*,
				json_build_object(
					'tag_id', t.tag_id,
					'tag_name', t.tag_name,
					'tag_description', t.tag_description
				) as tag
			FROM blogs b
			LEFT JOIN tags t ON b.tag_id = t.tag_id
			ORDER BY b.created_at DESC
		`;
	}

	static async findById(id: number): Promise<Blog | null> {
		const result = await sql<Blog[]>`
			SELECT 
				b.*,
				json_build_object(
					'tag_id', t.tag_id,
					'tag_name', t.tag_name,
					'tag_description', t.tag_description
				) as tag
			FROM blogs b
			LEFT JOIN tags t ON b.tag_id = t.tag_id
			WHERE b.id = ${id}
		`;
		return result[0] || null;
	}

	static async findBySlug(slug: string): Promise<Blog | null> {
		const result = await sql<Blog[]>`
			SELECT 
				b.*,
				json_build_object(
					'tag_id', t.tag_id,
					'tag_name', t.tag_name,
					'tag_description', t.tag_description
				) as tag
			FROM blogs b
			LEFT JOIN tags t ON b.tag_id = t.tag_id
			WHERE b.slug = ${slug}
		`;
		return result[0] || null;
	}

	static async create(data: CreateBlogRequest): Promise<Blog> {
		const result = await sql<Blog[]>`
			INSERT INTO blogs (title, author, slug, excerpt, thumbnail, content, time_read, tag_id)
			VALUES (${data.title}, ${data.author}, ${data.slug}, ${data.excerpt}, ${data.thumbnail}, ${sql.json(data.content)}, ${
				data.time_read
			}, ${data.tag_id})
			RETURNING *
		`;
		return result[0];
	}

	static async update(
		id: number,
		data: Partial<CreateBlogRequest>,
	): Promise<Blog | null> {
		const result = await sql<Blog[]>`
			UPDATE blogs 
			SET title = COALESCE(${data.title}, title),
				author = COALESCE(${data.author}, author),
				slug = COALESCE(${data.slug}, slug),
				excerpt = COALESCE(${data.excerpt}, excerpt),
				thumbnail = COALESCE(${data.thumbnail}, thumbnail),
				content = COALESCE(${data.content ? sql.json(data.content) : null}, content),
				time_read = COALESCE(${data.time_read}, time_read),
				tag_id = COALESCE(${data.tag_id}, tag_id),
				updated_at = CURRENT_TIMESTAMP
			WHERE id = ${id}
			RETURNING *
		`;
		return result[0] || null;
	}

	static async delete(id: number): Promise<boolean> {
		const result = await sql`DELETE FROM blogs WHERE id = ${id}`;
		return result.count > 0;
	}
}
