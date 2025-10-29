import type { Context } from "hono";
import { BlogsService } from "../services";
import type { CreateBlogRequest } from "../types";

export class BlogsController {
	static async getAllBlogs(c: Context) {
		try {
			const blogs = await BlogsService.getAllBlogs();
			return c.json({ success: true, data: blogs });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
		}
	}

	static async getBlogById(c: Context) {
		try {
			const id = parseInt(c.req.param("id"), 10);
			const blog = await BlogsService.getBlogById(id);
			if (!blog) {
				return c.json({ success: false, error: "Blog not found" }, 404);
			}
			return c.json({ success: true, data: blog });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
		}
	}

	static async getBlogBySlug(c: Context) {
		try {
			const slug = c.req.param("slug");
			const blog = await BlogsService.getBlogBySlug(slug);
			if (!blog) {
				return c.json({ success: false, error: "Blog not found" }, 404);
			}
			return c.json({ success: true, data: blog });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
		}
	}

	static async createBlog(c: Context) {
		try {
			const data = await c.req.json() as CreateBlogRequest;
			const blog = await BlogsService.createBlog(data);
			return c.json({ success: true, data: blog }, 201);
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 400);
		}
	}

	static async updateBlog(c: Context) {
		try {
			const id = parseInt(c.req.param("id"), 10);
			const data = await c.req.json() as Partial<CreateBlogRequest>;
			const blog = await BlogsService.updateBlog(id, data);
			if (!blog) {
				return c.json({ success: false, error: "Blog not found" }, 404);
			}
			return c.json({ success: true, data: blog });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 400);
		}
	}

	static async deleteBlog(c: Context) {
		try {
			const id = parseInt(c.req.param("id"), 10);
			const deleted = await BlogsService.deleteBlog(id);
			if (!deleted) {
				return c.json({ success: false, error: "Blog not found" }, 404);
			}
			return c.json({ success: true, message: "Blog deleted successfully" });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
		}
	}
}
