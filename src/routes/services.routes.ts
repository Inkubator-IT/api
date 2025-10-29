import { Hono } from "hono";
import { ServicesController } from "../controllers";

export const servicesRoutes = new Hono()
	.get("/", ServicesController.getAllServices)
	.get("/:id", ServicesController.getServiceById)
	.post("/", ServicesController.createService)
	.put("/:id", ServicesController.updateService)
	.delete("/:id", ServicesController.deleteService);
