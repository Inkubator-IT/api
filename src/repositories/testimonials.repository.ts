import { sql } from "../db";
import type { Testimonial, CreateTestimonialRequest } from "../types";

export class TestimonialsRepository {
	static async findAll(): Promise<Testimonial[]> {
		return await sql<Testimonial[]>`SELECT * FROM testimonials ORDER BY created_at DESC`;
	}

	static async findById(id: number): Promise<Testimonial | null> {
		const result = await sql<Testimonial[]>`SELECT * FROM testimonials WHERE id = ${id}`;
		return result[0] || null;
	}

	static async create(data: CreateTestimonialRequest): Promise<Testimonial> {
		const result = await sql<Testimonial[]>`
			INSERT INTO testimonials (full_name, role, description)
			VALUES (${data.full_name}, ${data.role}, ${data.description})
			RETURNING *
		`;
		return result[0];
	}

	static async update(
		id: number,
		data: Partial<CreateTestimonialRequest>,
	): Promise<Testimonial | null> {
		const result = await sql<Testimonial[]>`
			UPDATE testimonials 
			SET full_name = COALESCE(${data.full_name ?? null}, full_name),
				role = COALESCE(${data.role ?? null}, role),
				description = COALESCE(${data.description ?? null}, description),
				updated_at = CURRENT_TIMESTAMP
			WHERE id = ${id}
			RETURNING *
		`;
		return result[0] || null;
	}

	static async delete(id: number): Promise<boolean> {
		const result = await sql`DELETE FROM testimonials WHERE id = ${id}`;
		return result.count > 0;
	}
}
