import { TechStackRepository } from "../repositories";
import type { TechStack, CreateTechStackRequest } from "../types";

export class TechStackService {
	static async getAllTechStacks(): Promise<TechStack[]> {
		return await TechStackRepository.findAll();
	}

	static async getTechStackById(
		techStackId: number,
	): Promise<TechStack | null> {
		if (!techStackId || techStackId <= 0) {
			throw new Error("Invalid tech stack ID");
		}
		return await TechStackRepository.findById(techStackId);
	}

	static async createTechStack(
		data: CreateTechStackRequest,
	): Promise<TechStack> {
		if (!data.tech_stack_name || data.tech_stack_name.trim().length === 0) {
			throw new Error("Tech stack name is required");
		}
		return await TechStackRepository.create(data);
	}

	static async updateTechStack(
		techStackId: number,
		data: Partial<CreateTechStackRequest>,
	): Promise<TechStack | null> {
		if (!techStackId || techStackId <= 0) {
			throw new Error("Invalid tech stack ID");
		}
		return await TechStackRepository.update(techStackId, data);
	}

	static async deleteTechStack(techStackId: number): Promise<boolean> {
		if (!techStackId || techStackId <= 0) {
			throw new Error("Invalid tech stack ID");
		}
		return await TechStackRepository.delete(techStackId);
	}
}
