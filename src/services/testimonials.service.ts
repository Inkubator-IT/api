import { TestimonialsRepository } from "../repositories";
import type { Testimonial, CreateTestimonialRequest } from "../types";

export class TestimonialsService {
	static async getAllTestimonials(): Promise<Testimonial[]> {
		return await TestimonialsRepository.findAll();
	}

	static async getTestimonialById(id: number): Promise<Testimonial | null> {
		if (!id || id <= 0) {
			throw new Error("Invalid testimonial ID");
		}
		return await TestimonialsRepository.findById(id);
	}

	static async createTestimonial(data: CreateTestimonialRequest): Promise<Testimonial> {
		if (!data.full_name || data.full_name.trim().length === 0) {
			throw new Error("Full name is required");
		}
		if (data.full_name.length > 100) {
			throw new Error("Full name cannot exceed 100 characters");
		}
		if (!data.role || data.role.trim().length === 0) {
			throw new Error("Role is required");
		}
		if (data.role.length > 100) {
			throw new Error("Role cannot exceed 100 characters");
		}
		if (!data.description || data.description.trim().length === 0) {
			throw new Error("Description is required");
		}
		if (data.description.length > 500) {
			throw new Error("Description cannot exceed 500 characters");
		}
		return await TestimonialsRepository.create(data);
	}

	static async updateTestimonial(
		id: number,
		data: Partial<CreateTestimonialRequest>,
	): Promise<Testimonial | null> {
		if (!id || id <= 0) {
			throw new Error("Invalid testimonial ID");
		}
		if (data.full_name !== undefined && data.full_name.length > 100) {
			throw new Error("Full name cannot exceed 100 characters");
		}
		if (data.role !== undefined && data.role.length > 100) {
			throw new Error("Role cannot exceed 100 characters");
		}
		if (data.description !== undefined && data.description.length > 500) {
			throw new Error("Description cannot exceed 500 characters");
		}
		return await TestimonialsRepository.update(id, data);
	}

	static async deleteTestimonial(id: number): Promise<boolean> {
		if (!id || id <= 0) {
			throw new Error("Invalid testimonial ID");
		}
		return await TestimonialsRepository.delete(id);
	}
}
