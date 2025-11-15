import { BlogsRepository } from "../repositories";
import type { Blog, CreateBlogRequest, BlogLike } from "../types";

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
		if (!data.content || !data.content.content || data.content.content.length === 0) {
			throw new Error("Blog content is required");
		}
		return await BlogsRepository.create(data);
	}

	static async updateBlog(id: number, data: Partial<CreateBlogRequest>): Promise<Blog | null> {
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

	static async getLikeCount(blogId: number): Promise<number> {
		if (!blogId || blogId <= 0) {
			throw new Error("Invalid blog ID");
		}
		return await BlogsRepository.getLikeCount(blogId);
	}

	static async hasUserLiked(blogId: number, userIdentifier: string): Promise<boolean> {
		if (!blogId || blogId <= 0) {
			throw new Error("Invalid blog ID");
		}
		if (!userIdentifier || userIdentifier.trim().length === 0) {
			throw new Error("User identifier is required");
		}
		return await BlogsRepository.hasUserLiked(blogId, userIdentifier);
	}

	static async toggleLike(blogId: number, userIdentifier: string): Promise<{ liked: boolean; likeCount: number }> {
		if (!blogId || blogId <= 0) {
			throw new Error("Invalid blog ID");
		}
		if (!userIdentifier || userIdentifier.trim().length === 0) {
			throw new Error("User identifier is required");
		}

		const blog = await BlogsRepository.findById(blogId);
		if (!blog) {
			throw new Error("Blog not found");
		}

		const hasLiked = await BlogsRepository.hasUserLiked(blogId, userIdentifier);

		if (hasLiked) {
			await BlogsRepository.removeLike(blogId, userIdentifier);
		} else {
			await BlogsRepository.addLike(blogId, userIdentifier);
		}

		const likeCount = await BlogsRepository.getLikeCount(blogId);

		return {
			liked: !hasLiked,
			likeCount,
		};
	}
}
