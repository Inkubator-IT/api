import { TagsRepository } from "../repositories";
import type { Tag, CreateTagRequest } from "../types";

export class TagsService {
	static async getAllTags(): Promise<Tag[]> {
		return await TagsRepository.findAll();
	}

	static async getTagById(tagId: number): Promise<Tag | null> {
		if (!tagId || tagId <= 0) {
			throw new Error("Invalid tag ID");
		}
		return await TagsRepository.findById(tagId);
	}

	static async createTag(data: CreateTagRequest): Promise<Tag> {
		if (!data.tag_name || data.tag_name.trim().length === 0) {
			throw new Error("Tag name is required");
		}
		return await TagsRepository.create(data);
	}

	static async updateTag(
		tagId: number,
		data: Partial<CreateTagRequest>,
	): Promise<Tag | null> {
		if (!tagId || tagId <= 0) {
			throw new Error("Invalid tag ID");
		}
		return await TagsRepository.update(tagId, data);
	}

	static async deleteTag(tagId: number): Promise<boolean> {
		if (!tagId || tagId <= 0) {
			throw new Error("Invalid tag ID");
		}
		return await TagsRepository.delete(tagId);
	}
}
