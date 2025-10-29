import { sql } from "../db";
import type { Project, CreateProjectRequest } from "../types";

export class ProjectsRepository {
	static async findAll(): Promise<Project[]> {
		return await sql<Project[]>`SELECT * FROM projects ORDER BY created_at DESC`;
	}

	static async findById(id: number): Promise<Project | null> {
		const result = await sql<Project[]>`SELECT * FROM projects WHERE id = ${id}`;
		return result[0] || null;
	}

	static async create(data: CreateProjectRequest): Promise<Project> {
		const result = await sql<Project[]>`
			INSERT INTO projects (title, description, owner, url, tag_id, tech_stack_id, testimonial)
			VALUES (${data.title}, ${data.description}, ${data.owner}, ${data.url}, ${data.tag_id}, ${data.tech_stack_id}, ${data.testimonial})
			RETURNING *
		`;
		return result[0];
	}

	static async update(id: number, data: Partial<CreateProjectRequest>): Promise<Project | null> {
		const result = await sql<Project[]>`
			UPDATE projects 
			SET title = COALESCE(${data.title}, title),
				description = COALESCE(${data.description}, description),
				owner = COALESCE(${data.owner}, owner),
				url = COALESCE(${data.url}, url),
				tag_id = COALESCE(${data.tag_id}, tag_id),
				tech_stack_id = COALESCE(${data.tech_stack_id}, tech_stack_id),
				testimonial = COALESCE(${data.testimonial}, testimonial),
				updated_at = CURRENT_TIMESTAMP
			WHERE id = ${id}
			RETURNING *
		`;
		return result[0] || null;
	}

	static async delete(id: number): Promise<boolean> {
		const result = await sql`DELETE FROM projects WHERE id = ${id}`;
		return result.count > 0;
	}
}
