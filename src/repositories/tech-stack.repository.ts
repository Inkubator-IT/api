import { sql } from "../db";
import type { TechStack, CreateTechStackRequest } from "../types";

export class TechStackRepository {
	static async findAll(): Promise<TechStack[]> {
		return await sql<TechStack[]>`SELECT * FROM tech_stack ORDER BY tech_stack_name`;
	}

	static async findById(techStackId: number): Promise<TechStack | null> {
		const result = await sql<TechStack[]>`SELECT * FROM tech_stack WHERE tech_stack_id = ${techStackId}`;
		return result[0] || null;
	}

	static async create(data: CreateTechStackRequest): Promise<TechStack> {
		const result = await sql<TechStack[]>`
			INSERT INTO tech_stack (tech_stack_name, tech_stack_description)
			VALUES (${data.tech_stack_name}, ${data.tech_stack_description})
			RETURNING *
		`;
		return result[0];
	}

	static async update(techStackId: number, data: Partial<CreateTechStackRequest>): Promise<TechStack | null> {
		const result = await sql<TechStack[]>`
			UPDATE tech_stack 
			SET tech_stack_name = COALESCE(${data.tech_stack_name}, tech_stack_name),
				tech_stack_description = COALESCE(${data.tech_stack_description}, tech_stack_description),
				updated_at = CURRENT_TIMESTAMP
			WHERE tech_stack_id = ${techStackId}
			RETURNING *
		`;
		return result[0] || null;
	}

	static async delete(techStackId: number): Promise<boolean> {
		const result = await sql`DELETE FROM tech_stack WHERE tech_stack_id = ${techStackId}`;
		return result.count > 0;
	}
}
