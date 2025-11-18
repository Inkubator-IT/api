import type { Context } from "hono";
import { ProjectsService } from "../services";
import type { CreateProjectRequest } from "../types";

export class ProjectsController {
	static async getAllProjects(c: Context) {
		try {
			const scope = c.req.query("scope");
			const category = c.req.query("category");
			const featured = c.req.query("featured");
			const search = c.req.query("search");

			const projects = await ProjectsService.getAllProjects({
				scope,
				category,
				featured: featured === "true" ? true : undefined,
				search,
			});
			return c.json({ success: true, data: projects });
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

	static async getProjectById(c: Context) {
		try {
			const id = parseInt(c.req.param("id"), 10);
			const project = await ProjectsService.getProjectById(id);
			if (!project) {
				return c.json({ success: false, error: "Project not found" }, 404);
			}
			return c.json({ success: true, data: project });
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

	static async createProject(c: Context) {
		try {
			const data = (await c.req.json()) as CreateProjectRequest;
			const project = await ProjectsService.createProject(data);
			return c.json({ success: true, data: project }, 201);
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

	static async updateProject(c: Context) {
		try {
			const id = parseInt(c.req.param("id"), 10);
			const data = (await c.req.json()) as Partial<CreateProjectRequest>;
			const project = await ProjectsService.updateProject(id, data);
			if (!project) {
				return c.json({ success: false, error: "Project not found" }, 404);
			}
			return c.json({ success: true, data: project });
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

	static async deleteProject(c: Context) {
		try {
			const id = parseInt(c.req.param("id"), 10);
			const deleted = await ProjectsService.deleteProject(id);
			if (!deleted) {
				return c.json({ success: false, error: "Project not found" }, 404);
			}
			return c.json({ success: true, message: "Project deleted successfully" });
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
