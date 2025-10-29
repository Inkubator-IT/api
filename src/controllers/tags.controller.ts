import type { Context } from "hono";
import { TagsService } from "../services";
import type { CreateTagRequest } from "../types";

export class TagsController {
	static async getAllTags(c: Context) {
		try {
			const tags = await TagsService.getAllTags();
			return c.json({ success: true, data: tags });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
		}
	}

	static async getTagById(c: Context) {
		try {
			const tagId = parseInt(c.req.param("id"), 10);
			const tag = await TagsService.getTagById(tagId);
			if (!tag) {
				return c.json({ success: false, error: "Tag not found" }, 404);
			}
			return c.json({ success: true, data: tag });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
		}
	}

	static async createTag(c: Context) {
		try {
			const data = await c.req.json() as CreateTagRequest;
			const tag = await TagsService.createTag(data);
			return c.json({ success: true, data: tag }, 201);
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 400);
		}
	}

	static async updateTag(c: Context) {
		try {
			const tagId = parseInt(c.req.param("id"), 10);
			const data = await c.req.json() as Partial<CreateTagRequest>;
			const tag = await TagsService.updateTag(tagId, data);
			if (!tag) {
				return c.json({ success: false, error: "Tag not found" }, 404);
			}
			return c.json({ success: true, data: tag });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 400);
		}
	}

	static async deleteTag(c: Context) {
		try {
			const tagId = parseInt(c.req.param("id"), 10);
			const deleted = await TagsService.deleteTag(tagId);
			if (!deleted) {
				return c.json({ success: false, error: "Tag not found" }, 404);
			}
			return c.json({ success: true, message: "Tag deleted successfully" });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
		}
	}
}
