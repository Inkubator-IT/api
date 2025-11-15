import { db } from "../db";
import { projects, projectTechStack } from "../db/schema";
import { eq, desc, like, or, and } from "drizzle-orm";
import type { Project, CreateProjectRequest } from "../types";

interface ProjectFilters {
	scope?: string;
	category?: string;
	featured?: boolean;
	search?: string;
}

export class ProjectsRepository {
	static async findAll(filters?: ProjectFilters): Promise<Project[]> {
		const conditions = [];

		if (filters?.scope) {
			conditions.push(eq(projects.scope, filters.scope));
		}
		if (filters?.category) {
			conditions.push(eq(projects.category, filters.category));
		}
		if (filters?.featured !== undefined) {
			conditions.push(eq(projects.featured, filters.featured));
		}
		if (filters?.search) {
			conditions.push(
				or(
					like(projects.title, `%${filters.search}%`),
					like(projects.description, `%${filters.search}%`)
				)
			);
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		return await db.query.projects.findMany({
			where: whereClause,
			orderBy: desc(projects.created_at),
			with: {
				techStacks: {
					with: {
						techStack: true,
					},
				},
			},
		}) as unknown as Project[];
	}

	static async findById(id: number): Promise<Project | null> {
		const result = await db.query.projects.findFirst({
			where: eq(projects.id, id),
			with: {
				techStacks: {
					with: {
						techStack: true,
					},
				},
			},
		});
		return (result as unknown as Project) || null;
	}

	static async create(data: CreateProjectRequest): Promise<Project> {
		const [project] = await db.insert(projects).values({
			title: data.title,
			description: data.description,
			owner: data.owner,
			url: data.url,
			category: data.category,
			scope: data.scope,
			thumbnail: data.thumbnail,
			images: data.images,
			featured: data.featured || false,
			tag_id: data.tag_id,
			testimonial: data.testimonial,
		}).returning();

		if (data.tech_stack_ids && data.tech_stack_ids.length > 0) {
			await db.insert(projectTechStack).values(
				data.tech_stack_ids.map(techStackId => ({
					project_id: project.id,
					tech_stack_id: techStackId,
				}))
			);
		}

		return project as unknown as Project;
	}

	static async update(id: number, data: Partial<CreateProjectRequest>): Promise<Project | null> {
		const updateData: any = {};

		if (data.title !== undefined) updateData.title = data.title;
		if (data.description !== undefined) updateData.description = data.description;
		if (data.owner !== undefined) updateData.owner = data.owner;
		if (data.url !== undefined) updateData.url = data.url;
		if (data.category !== undefined) updateData.category = data.category;
		if (data.scope !== undefined) updateData.scope = data.scope;
		if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
		if (data.images !== undefined) updateData.images = data.images;
		if (data.featured !== undefined) updateData.featured = data.featured;
		if (data.tag_id !== undefined) updateData.tag_id = data.tag_id;
		if (data.testimonial !== undefined) updateData.testimonial = data.testimonial;

		updateData.updated_at = new Date();

		const [project] = await db
			.update(projects)
			.set(updateData)
			.where(eq(projects.id, id))
			.returning();

		if (data.tech_stack_ids !== undefined) {
			await db.delete(projectTechStack).where(eq(projectTechStack.project_id, id));

			if (data.tech_stack_ids.length > 0) {
				await db.insert(projectTechStack).values(
					data.tech_stack_ids.map(techStackId => ({
						project_id: id,
						tech_stack_id: techStackId,
					}))
				);
			}
		}

		return (project as unknown as Project) || null;
	}

	static async delete(id: number): Promise<boolean> {
		const result = await db.delete(projects).where(eq(projects.id, id)).returning();
		return result.length > 0;
	}
}