import { db } from "../db";
import { tags } from "../db/schema";
import { eq, asc } from "drizzle-orm";
import type { Tag, CreateTagRequest } from "../types";

export class TagsRepository {
	static async findAll(): Promise<Tag[]> {
		return await db.select().from(tags).orderBy(asc(tags.tag_name)) as unknown as Tag[];
	}

	static async findById(tagId: number): Promise<Tag | null> {
		const result = await db.select().from(tags).where(eq(tags.tag_id, tagId));
		return (result[0] as unknown as Tag) || null;
	}

	static async create(data: CreateTagRequest): Promise<Tag> {
		const result = await db.insert(tags).values({
			tag_name: data.tag_name,
			tag_description: data.tag_description,
		}).returning();
		return result[0] as unknown as Tag;
	}

	static async update(tagId: number, data: Partial<CreateTagRequest>): Promise<Tag | null> {
		const updateData: any = {};

		if (data.tag_name !== undefined) updateData.tag_name = data.tag_name;
		if (data.tag_description !== undefined) updateData.tag_description = data.tag_description;

		updateData.updated_at = new Date();

		const result = await db
			.update(tags)
			.set(updateData)
			.where(eq(tags.tag_id, tagId))
			.returning();

		return (result[0] as unknown as Tag) || null;
	}

	static async delete(tagId: number): Promise<boolean> {
		const result = await db.delete(tags).where(eq(tags.tag_id, tagId)).returning();
		return result.length > 0;
	}
}
