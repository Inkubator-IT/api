import { Hono } from "hono";
import { BlogsController } from "../controllers";

export const blogsRoutes = new Hono()
	.get("/", BlogsController.getAllBlogs)
	.get("/:id", BlogsController.getBlogById)
	.get("/slug/:slug", BlogsController.getBlogBySlug)
	.get("/:id/likes", BlogsController.getLikes)
	.post("/:id/likes", BlogsController.toggleLike)
	.get("/:id/likes/status", BlogsController.checkLikeStatus)
	.post("/", BlogsController.createBlog)
	.put("/:id", BlogsController.updateBlog)
	.delete("/:id", BlogsController.deleteBlog);
