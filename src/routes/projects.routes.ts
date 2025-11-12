import { Hono } from "hono";
import { ProjectsController } from "../controllers";

export const projectsRoutes = new Hono()
	.get("/", ProjectsController.getAllProjects)
	.get("/:id", ProjectsController.getProjectById)
	.post("/", ProjectsController.createProject)
	.put("/:id", ProjectsController.updateProject)
	.delete("/:id", ProjectsController.deleteProject);
