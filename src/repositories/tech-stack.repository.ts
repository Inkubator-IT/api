import { db } from "../db";
import { techStack } from "../db/schema";
import { eq, asc } from "drizzle-orm";
import type { TechStack, CreateTechStackRequest } from "../types";

export class TechStackRepository {
	static async findAll(): Promise<TechStack[]> {
		return await db.select().from(techStack).orderBy(asc(techStack.tech_stack_name)) as unknown as TechStack[];
	}

	static async findById(techStackId: number): Promise<TechStack | null> {
		const result = await db.select().from(techStack).where(eq(techStack.tech_stack_id, techStackId));
		return (result[0] as unknown as TechStack) || null;
	}

	static async create(data: CreateTechStackRequest): Promise<TechStack> {
		const result = await db.insert(techStack).values({
			tech_stack_name: data.tech_stack_name,
			tech_stack_description: data.tech_stack_description,
			icon_url: data.icon_url,
		}).returning();
		return result[0] as unknown as TechStack;
	}

	static async update(techStackId: number, data: Partial<CreateTechStackRequest>): Promise<TechStack | null> {
		const updateData: any = {};

		if (data.tech_stack_name !== undefined) updateData.tech_stack_name = data.tech_stack_name;
		if (data.tech_stack_description !== undefined) updateData.tech_stack_description = data.tech_stack_description;
		if (data.icon_url !== undefined) updateData.icon_url = data.icon_url;

		updateData.updated_at = new Date();

		const result = await db
			.update(techStack)
			.set(updateData)
			.where(eq(techStack.tech_stack_id, techStackId))
			.returning();

		return (result[0] as unknown as TechStack) || null;
	}

	static async delete(techStackId: number): Promise<boolean> {
		const result = await db.delete(techStack).where(eq(techStack.tech_stack_id, techStackId)).returning();
		return result.length > 0;
	}
}
