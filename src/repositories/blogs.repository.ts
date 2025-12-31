import { db } from "../db";
import { blogs, blogLikes, tags } from "../db/schema";
import { eq, desc, and, count } from "drizzle-orm";
import type { Blog, CreateBlogRequest, BlogLike } from "../types";

export class BlogsRepository {
	private static parseBlogContent(blog: any): Blog {
		if (blog && blog.content && typeof blog.content === "string") {
			try {
				blog.content = JSON.parse(blog.content);
			} catch (error) {
				console.error("Error parsing blog content:", error);
			}
		}
		return blog as Blog;
	}

	static async findAll(): Promise<Blog[]> {
		const results = await db
			.select({
				id: blogs.id,
				title: blogs.title,
				author: blogs.author,
				slug: blogs.slug,
				excerpt: blogs.excerpt,
				thumbnail: blogs.thumbnail,
				content: blogs.content,
				time_read: blogs.time_read,
				tag_id: blogs.tag_id,
				created_at: blogs.created_at,
				updated_at: blogs.updated_at,
				tag: {
					tag_id: tags.tag_id,
					tag_name: tags.tag_name,
					tag_description: tags.tag_description,
				},
			})
			.from(blogs)
			.leftJoin(tags, eq(blogs.tag_id, tags.tag_id))
			.orderBy(desc(blogs.created_at));
	
		const blogsWithLikes = await Promise.all(
			results.map(async (blog) => {
				const parsedBlog = BlogsRepository.parseBlogContent(blog);
				const likeCount = await BlogsRepository.getLikeCount(blog.id);
				return {
					...parsedBlog,
					like_count: likeCount,
				} as Blog;
			}),
		);
	
		return blogsWithLikes;
	}

	static async findById(id: number): Promise<Blog | null> {
		const result = await db
			.select({
				id: blogs.id,
				title: blogs.title,
				author: blogs.author,
				slug: blogs.slug,
				excerpt: blogs.excerpt,
				thumbnail: blogs.thumbnail,
				content: blogs.content,
				time_read: blogs.time_read,
				tag_id: blogs.tag_id,
				created_at: blogs.created_at,
				updated_at: blogs.updated_at,
				tag: {
					tag_id: tags.tag_id,
					tag_name: tags.tag_name,
					tag_description: tags.tag_description,
				},
			})
			.from(blogs)
			.leftJoin(tags, eq(blogs.tag_id, tags.tag_id))
			.where(eq(blogs.id, id));

		return result[0] ? BlogsRepository.parseBlogContent(result[0]) : null;
	}

	static async findBySlug(slug: string): Promise<Blog | null> {
		const result = await db
			.select({
				id: blogs.id,
				title: blogs.title,
				author: blogs.author,
				slug: blogs.slug,
				excerpt: blogs.excerpt,
				thumbnail: blogs.thumbnail,
				content: blogs.content,
				time_read: blogs.time_read,
				tag_id: blogs.tag_id,
				created_at: blogs.created_at,
				updated_at: blogs.updated_at,
				tag: {
					tag_id: tags.tag_id,
					tag_name: tags.tag_name,
					tag_description: tags.tag_description,
				},
			})
			.from(blogs)
			.leftJoin(tags, eq(blogs.tag_id, tags.tag_id))
			.where(eq(blogs.slug, slug));

		return result[0] ? BlogsRepository.parseBlogContent(result[0]) : null;
	}

	static async create(data: CreateBlogRequest): Promise<Blog> {
		const result = await db
			.insert(blogs)
			.values({
				title: data.title,
				author: data.author,
				slug: data.slug,
				excerpt: data.excerpt,
				thumbnail: data.thumbnail,
				content:
					typeof data.content === "string"
						? data.content
						: JSON.stringify(data.content),
				time_read: data.time_read,
				tag_id: data.tag_id,
			})
			.returning();

		return BlogsRepository.findById(result[0].id) as Promise<Blog>;
	}

	static async update(
		id: number,
		data: Partial<CreateBlogRequest>,
	): Promise<Blog | null> {
		const updateData: any = {};

		if (data.title !== undefined) updateData.title = data.title;
		if (data.author !== undefined) updateData.author = data.author;
		if (data.slug !== undefined) updateData.slug = data.slug;
		if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
		if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
		if (data.content !== undefined) {
			updateData.content =
				typeof data.content === "string"
					? data.content
					: JSON.stringify(data.content);
		}
		if (data.time_read !== undefined) updateData.time_read = data.time_read;
		if (data.tag_id !== undefined) updateData.tag_id = data.tag_id;

		updateData.updated_at = new Date();

		const result = await db
			.update(blogs)
			.set(updateData)
			.where(eq(blogs.id, id))
			.returning();

		return result[0] ? BlogsRepository.findById(id) : null;
	}

	static async delete(id: number): Promise<boolean> {
		const result = await db.delete(blogs).where(eq(blogs.id, id)).returning();
		return result.length > 0;
	}

	static async getLikeCount(blogId: number): Promise<number> {
		const result = await db
			.select({ count: count() })
			.from(blogLikes)
			.where(eq(blogLikes.blog_id, blogId));

		return result[0]?.count || 0;
	}

	static async hasUserLiked(
		blogId: number,
		userIdentifier: string,
	): Promise<boolean> {
		const result = await db
			.select()
			.from(blogLikes)
			.where(
				and(
					eq(blogLikes.blog_id, blogId),
					eq(blogLikes.user_identifier, userIdentifier),
				),
			);

		return result.length > 0;
	}

	static async addLike(
		blogId: number,
		userIdentifier: string,
	): Promise<BlogLike> {
		const result = await db
			.insert(blogLikes)
			.values({
				blog_id: blogId,
				user_identifier: userIdentifier,
			})
			.returning();

		return result[0] as unknown as BlogLike;
	}

	static async removeLike(
		blogId: number,
		userIdentifier: string,
	): Promise<boolean> {
		const result = await db
			.delete(blogLikes)
			.where(
				and(
					eq(blogLikes.blog_id, blogId),
					eq(blogLikes.user_identifier, userIdentifier),
				),
			)
			.returning();

		return result.length > 0;
	}
}
