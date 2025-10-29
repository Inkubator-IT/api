import { Hono } from "hono";
import { BlogsController } from "../controllers";

export const blogsRoutes = new Hono()
	.get("/", BlogsController.getAllBlogs)
	.get("/:id", BlogsController.getBlogById)
	.get("/slug/:slug", BlogsController.getBlogBySlug)
	.post("/", BlogsController.createBlog)
	.put("/:id", BlogsController.updateBlog)
	.delete("/:id", BlogsController.deleteBlog);
