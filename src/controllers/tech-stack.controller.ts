import type { Context } from "hono";
import { TechStackService } from "../services";
import type { CreateTechStackRequest } from "../types";

export class TechStackController {
	static async getAllTechStacks(c: Context) {
		try {
			const techStacks = await TechStackService.getAllTechStacks();
			return c.json({ success: true, data: techStacks });
		} catch (error) {
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				},
				500,
			);
		}
	}

	static async getTechStackById(c: Context) {
		try {
			const techStackId = parseInt(c.req.param("id"), 10);
			const techStack = await TechStackService.getTechStackById(techStackId);
			if (!techStack) {
				return c.json({ success: false, error: "Tech stack not found" }, 404);
			}
			return c.json({ success: true, data: techStack });
		} catch (error) {
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				},
				500,
			);
		}
	}

	static async createTechStack(c: Context) {
		try {
			const data = (await c.req.json()) as CreateTechStackRequest;
			const techStack = await TechStackService.createTechStack(data);
			return c.json({ success: true, data: techStack }, 201);
		} catch (error) {
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				},
				400,
			);
		}
	}

	static async updateTechStack(c: Context) {
		try {
			const techStackId = parseInt(c.req.param("id"), 10);
			const data = (await c.req.json()) as Partial<CreateTechStackRequest>;
			const techStack = await TechStackService.updateTechStack(
				techStackId,
				data,
			);
			if (!techStack) {
				return c.json({ success: false, error: "Tech stack not found" }, 404);
			}
			return c.json({ success: true, data: techStack });
		} catch (error) {
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				},
				400,
			);
		}
	}

	static async deleteTechStack(c: Context) {
		try {
			const techStackId = parseInt(c.req.param("id"), 10);
			const deleted = await TechStackService.deleteTechStack(techStackId);
			if (!deleted) {
				return c.json({ success: false, error: "Tech stack not found" }, 404);
			}
			return c.json({
				success: true,
				message: "Tech stack deleted successfully",
			});
		} catch (error) {
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				},
				500,
			);
		}
	}
}
