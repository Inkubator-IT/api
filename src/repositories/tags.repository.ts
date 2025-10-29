import { sql } from "../db";
import type { Tag, CreateTagRequest } from "../types";

export class TagsRepository {
	static async findAll(): Promise<Tag[]> {
		return await sql<Tag[]>`SELECT * FROM tags ORDER BY tag_name`;
	}

	static async findById(tagId: number): Promise<Tag | null> {
		const result = await sql<Tag[]>`SELECT * FROM tags WHERE tag_id = ${tagId}`;
		return result[0] || null;
	}

	static async create(data: CreateTagRequest): Promise<Tag> {
		const result = await sql<Tag[]>`
			INSERT INTO tags (tag_name, tag_description)
			VALUES (${data.tag_name}, ${data.tag_description})
			RETURNING *
		`;
		return result[0];
	}

	static async update(tagId: number, data: Partial<CreateTagRequest>): Promise<Tag | null> {
		const result = await sql<Tag[]>`
			UPDATE tags 
			SET tag_name = COALESCE(${data.tag_name}, tag_name),
				tag_description = COALESCE(${data.tag_description}, tag_description),
				updated_at = CURRENT_TIMESTAMP
			WHERE tag_id = ${tagId}
			RETURNING *
		`;
		return result[0] || null;
	}

	static async delete(tagId: number): Promise<boolean> {
		const result = await sql`DELETE FROM tags WHERE tag_id = ${tagId}`;
		return result.count > 0;
	}
}
