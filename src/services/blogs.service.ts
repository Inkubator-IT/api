import { BlogsRepository } from "../repositories";
import type { Blog, CreateBlogRequest } from "../types";

export class BlogsService {
	static async getAllBlogs(): Promise<Blog[]> {
		return await BlogsRepository.findAll();
	}

	static async getBlogById(id: number): Promise<Blog | null> {
		if (!id || id <= 0) {
			throw new Error("Invalid blog ID");
		}
		return await BlogsRepository.findById(id);
	}

	static async getBlogBySlug(slug: string): Promise<Blog | null> {
		if (!slug || slug.trim().length === 0) {
			throw new Error("Blog slug is required");
		}
		return await BlogsRepository.findBySlug(slug);
	}

	static async createBlog(data: CreateBlogRequest): Promise<Blog> {
		if (!data.title || data.title.trim().length === 0) {
			throw new Error("Blog title is required");
		}
		if (!data.author || data.author.trim().length === 0) {
			throw new Error("Blog author is required");
		}
		if (!data.slug || data.slug.trim().length === 0) {
			throw new Error("Blog slug is required");
		}
		if (
			!data.content ||
			!Array.isArray(data.content) ||
			data.content.length === 0
		) {
			throw new Error("Blog content is required");
		}
		return await BlogsRepository.create(data);
	}

	static async updateBlog(
		id: number,
		data: Partial<CreateBlogRequest>,
	): Promise<Blog | null> {
		if (!id || id <= 0) {
			throw new Error("Invalid blog ID");
		}
		return await BlogsRepository.update(id, data);
	}

	static async deleteBlog(id: number): Promise<boolean> {
		if (!id || id <= 0) {
			throw new Error("Invalid blog ID");
		}
		return await BlogsRepository.delete(id);
	}
}
