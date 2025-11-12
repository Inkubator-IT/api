import { Hono } from "hono";
import { TagsController } from "../controllers";

export const tagsRoutes = new Hono()
	.get("/", TagsController.getAllTags)
	.get("/:id", TagsController.getTagById)
	.post("/", TagsController.createTag)
	.put("/:id", TagsController.updateTag)
	.delete("/:id", TagsController.deleteTag);
