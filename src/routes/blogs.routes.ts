import { Hono } from "hono";
import { BlogsController } from "../controllers";

export const blogsRoutes = new Hono()
	.get("/", BlogsController.getAllBlogs)
	.get("/slug/:slug", BlogsController.getBlogBySlug) // Must be before /:id
	.get("/:id", BlogsController.getBlogById)
	.get("/:id/likes", BlogsController.getLikeInfo)
	.post("/", BlogsController.createBlog)
	.post("/:id/likes", BlogsController.toggleLike)
	.put("/:id", BlogsController.updateBlog)
	.delete("/:id", BlogsController.deleteBlog);
