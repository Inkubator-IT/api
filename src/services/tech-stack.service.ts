import { TechStackRepository } from "../repositories";
import { toPublicUrl } from "../utils/media";
import type { TechStack, CreateTechStackRequest } from "../types";

export class TechStackService {
	private static withPublicIcon(techStack: TechStack | null): TechStack | null {
		if (!techStack) return techStack;
		return {
			...techStack,
			icon_url: (toPublicUrl(techStack.icon_url) ??
				techStack.icon_url) as TechStack["icon_url"],
		};
	}

	static async getAllTechStacks(): Promise<TechStack[]> {
		const stacks = await TechStackRepository.findAll();
		return stacks.map((stack) => this.withPublicIcon(stack)!) as TechStack[];
	}

	static async getTechStackById(
		techStackId: number,
	): Promise<TechStack | null> {
		if (!techStackId || techStackId <= 0) {
			throw new Error("Invalid tech stack ID");
		}
		const stack = await TechStackRepository.findById(techStackId);
		return this.withPublicIcon(stack);
	}

	static async createTechStack(
		data: CreateTechStackRequest,
	): Promise<TechStack> {
		if (!data.tech_stack_name || data.tech_stack_name.trim().length === 0) {
			throw new Error("Tech stack name is required");
		}
		const stack = await TechStackRepository.create(data);
		return this.withPublicIcon(stack)!;
	}

	static async updateTechStack(
		techStackId: number,
		data: Partial<CreateTechStackRequest>,
	): Promise<TechStack | null> {
		if (!techStackId || techStackId <= 0) {
			throw new Error("Invalid tech stack ID");
		}
		const stack = await TechStackRepository.update(techStackId, data);
		return this.withPublicIcon(stack);
	}

	static async deleteTechStack(techStackId: number): Promise<boolean> {
		if (!techStackId || techStackId <= 0) {
			throw new Error("Invalid tech stack ID");
		}
		return await TechStackRepository.delete(techStackId);
	}
}
