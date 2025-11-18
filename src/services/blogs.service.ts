import { BlogsRepository } from "../repositories";
import { triggerDeployHook } from "../lib/deploy-hook";
import { toPublicUrl } from "../utils/media";
import type { Blog, CreateBlogRequest } from "../types";

export class BlogsService {
	private static withPublicThumbnail(blog: Blog | null): Blog | null {
		if (!blog) return blog;
		return {
			...blog,
			thumbnail: (toPublicUrl(blog.thumbnail) ??
				blog.thumbnail) as Blog["thumbnail"],
		};
	}

	static async getAllBlogs(): Promise<Blog[]> {
		const blogs = await BlogsRepository.findAll();
		return blogs.map((blog) => this.withPublicThumbnail(blog)!) as Blog[];
	}

	static async getBlogById(id: number): Promise<Blog | null> {
		if (!id || id <= 0) {
			throw new Error("Invalid blog ID");
		}
		const blog = await BlogsRepository.findById(id);
		return this.withPublicThumbnail(blog);
	}

	static async getBlogBySlug(slug: string): Promise<Blog | null> {
		if (!slug || slug.trim().length === 0) {
			throw new Error("Blog slug is required");
		}
		const blog = await BlogsRepository.findBySlug(slug);
		return this.withPublicThumbnail(blog);
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
			!data.content.content ||
			data.content.content.length === 0
		) {
			throw new Error("Blog content is required");
		}
		const blog = await BlogsRepository.create(data);
		await triggerDeployHook("blog:create");
		return this.withPublicThumbnail(blog)!;
	}

	static async updateBlog(
		id: number,
		data: Partial<CreateBlogRequest>,
	): Promise<Blog | null> {
		if (!id || id <= 0) {
			throw new Error("Invalid blog ID");
		}
		const blog = await BlogsRepository.update(id, data);
		if (blog) {
			await triggerDeployHook("blog:update");
		}
		return this.withPublicThumbnail(blog);
	}

	static async deleteBlog(id: number): Promise<boolean> {
		if (!id || id <= 0) {
			throw new Error("Invalid blog ID");
		}
		const deleted = await BlogsRepository.delete(id);
		if (deleted) {
			await triggerDeployHook("blog:delete");
		}
		return deleted;
	}

	static async getLikeCount(blogId: number): Promise<number> {
		if (!blogId || blogId <= 0) {
			throw new Error("Invalid blog ID");
		}
		return await BlogsRepository.getLikeCount(blogId);
	}

	static async hasUserLiked(
		blogId: number,
		userIdentifier: string,
	): Promise<boolean> {
		if (!blogId || blogId <= 0) {
			throw new Error("Invalid blog ID");
		}
		if (!userIdentifier || userIdentifier.trim().length === 0) {
			throw new Error("User identifier is required");
		}
		return await BlogsRepository.hasUserLiked(blogId, userIdentifier);
	}

	static async toggleLike(
		blogId: number,
		userIdentifier: string,
	): Promise<{ liked: boolean; likeCount: number }> {
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
