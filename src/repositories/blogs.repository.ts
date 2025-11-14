import { sql } from "../db";
import type { Blog, CreateBlogRequest } from "../types";

export class BlogsRepository {
	static async findAll(): Promise<Blog[]> {
		return await sql<Blog[]>`
			SELECT 
				b.*,
				COALESCE(COUNT(bl.id), 0)::int as like_count,
				json_build_object(
					'tag_id', t.tag_id,
					'tag_name', t.tag_name,
					'tag_description', t.tag_description
				) as tag
			FROM blogs b
			LEFT JOIN tags t ON b.tag_id = t.tag_id
			LEFT JOIN blog_likes bl ON b.id = bl.blog_id
			GROUP BY b.id, t.tag_id, t.tag_name, t.tag_description
			ORDER BY b.created_at DESC
		`;
	}

	static async findById(id: number): Promise<Blog | null> {
		const result = await sql<Blog[]>`
			SELECT 
				b.*,
				COALESCE(COUNT(bl.id), 0)::int as like_count,
				json_build_object(
					'tag_id', t.tag_id,
					'tag_name', t.tag_name,
					'tag_description', t.tag_description
				) as tag
			FROM blogs b
			LEFT JOIN tags t ON b.tag_id = t.tag_id
			LEFT JOIN blog_likes bl ON b.id = bl.blog_id
			WHERE b.id = ${id}
			GROUP BY b.id, t.tag_id, t.tag_name, t.tag_description
		`;
		return result[0] || null;
	}

	static async findBySlug(slug: string): Promise<Blog | null> {
		const result = await sql<Blog[]>`
			SELECT 
				b.*,
				COALESCE(COUNT(bl.id), 0)::int as like_count,
				json_build_object(
					'tag_id', t.tag_id,
					'tag_name', t.tag_name,
					'tag_description', t.tag_description
				) as tag
			FROM blogs b
			LEFT JOIN tags t ON b.tag_id = t.tag_id
			LEFT JOIN blog_likes bl ON b.id = bl.blog_id
			WHERE b.slug = ${slug}
			GROUP BY b.id, t.tag_id, t.tag_name, t.tag_description
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

	static async getLikeCount(blogId: number): Promise<number> {
		const result = await sql<[{ count: string }]>`
			SELECT COUNT(*)::int as count
			FROM blog_likes
			WHERE blog_id = ${blogId}
		`;
		return parseInt(result[0]?.count || "0", 10);
	}

	static async hasLiked(blogId: number, userIdentifier: string): Promise<boolean> {
		const result = await sql<[{ exists: boolean }]>`
			SELECT EXISTS(
				SELECT 1 FROM blog_likes
				WHERE blog_id = ${blogId} AND user_identifier = ${userIdentifier}
			) as exists
		`;
		return result[0]?.exists || false;
	}

	static async toggleLike(blogId: number, userIdentifier: string): Promise<{ liked: boolean; count: number }> {
		// Check if user has already liked the blog
		const existing = await sql<[{ id: number }]>`
			SELECT id FROM blog_likes
			WHERE blog_id = ${blogId} AND user_identifier = ${userIdentifier}
		`;

		if (existing.length > 0) {
			// unlike
			await sql`
				DELETE FROM blog_likes
				WHERE blog_id = ${blogId} AND user_identifier = ${userIdentifier}
			`;
		} else {
			// like
			await sql`
				INSERT INTO blog_likes (blog_id, user_identifier)
				VALUES (${blogId}, ${userIdentifier})
				ON CONFLICT (blog_id, user_identifier) DO NOTHING
			`;
		}

		const count = await this.getLikeCount(blogId);
		const liked = await this.hasLiked(blogId, userIdentifier);
		
		return { liked, count };
	}
}
