import type { Context } from "hono";
import { TestimonialsService } from "../services";
import type { CreateTestimonialRequest } from "../types";

export class TestimonialsController {
	static async getAllTestimonials(c: Context) {
		try {
			const testimonials = await TestimonialsService.getAllTestimonials();
			return c.json({ success: true, data: testimonials });
		} catch (error) {
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				},
				500,
			);
		}
	}

	static async getTestimonialById(c: Context) {
		try {
			const id = parseInt(c.req.param("id"), 10);
			const testimonial = await TestimonialsService.getTestimonialById(id);
			if (!testimonial) {
				return c.json({ success: false, error: "Testimonial not found" }, 404);
			}
			return c.json({ success: true, data: testimonial });
		} catch (error) {
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				},
				500,
			);
		}
	}

	static async createTestimonial(c: Context) {
		try {
			const data = (await c.req.json()) as CreateTestimonialRequest;
			const testimonial = await TestimonialsService.createTestimonial(data);
			return c.json({ success: true, data: testimonial }, 201);
		} catch (error) {
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				},
				400,
			);
		}
	}

	static async updateTestimonial(c: Context) {
		try {
			const id = parseInt(c.req.param("id"), 10);
			const data = (await c.req.json()) as Partial<CreateTestimonialRequest>;
			const testimonial = await TestimonialsService.updateTestimonial(id, data);
			if (!testimonial) {
				return c.json({ success: false, error: "Testimonial not found" }, 404);
			}
			return c.json({ success: true, data: testimonial });
		} catch (error) {
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				},
				400,
			);
		}
	}

	static async deleteTestimonial(c: Context) {
		try {
			const id = parseInt(c.req.param("id"), 10);
			const deleted = await TestimonialsService.deleteTestimonial(id);
			if (!deleted) {
				return c.json({ success: false, error: "Testimonial not found" }, 404);
			}
			return c.json({ success: true, message: "Testimonial deleted successfully" });
		} catch (error) {
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				},
				500,
			);
		}
	}
}
