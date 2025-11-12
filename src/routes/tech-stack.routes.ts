import { Hono } from "hono";
import { TechStackController } from "../controllers";

export const techStackRoutes = new Hono()
	.get("/", TechStackController.getAllTechStacks)
	.get("/:id", TechStackController.getTechStackById)
	.post("/", TechStackController.createTechStack)
	.put("/:id", TechStackController.updateTechStack)
	.delete("/:id", TechStackController.deleteTechStack);
