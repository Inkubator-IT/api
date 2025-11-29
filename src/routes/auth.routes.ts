import { Hono } from "hono";
import { AuthController } from "../controllers";

export const authRoutes = new Hono()
	.all("/*", AuthController.handleAuth)
	.get("/session", AuthController.getSession)
	.get("/user", AuthController.getUser);
