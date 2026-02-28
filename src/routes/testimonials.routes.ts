import { Hono } from "hono";
import { TestimonialsController } from "../controllers";

export const testimonialsRoutes = new Hono()
	.get("/", TestimonialsController.getAllTestimonials)
	.get("/:id", TestimonialsController.getTestimonialById)
	.post("/", TestimonialsController.createTestimonial)
	.put("/:id", TestimonialsController.updateTestimonial)
	.delete("/:id", TestimonialsController.deleteTestimonial);
