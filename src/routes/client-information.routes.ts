import { Hono } from "hono";
import { ClientInformationController } from "../controllers";

export const clientInformationRoutes = new Hono()
	.get("/", ClientInformationController.getAllClientInformation)
	.get("/:id", ClientInformationController.getClientInformationById)
	.post("/", ClientInformationController.createClientInformation)
	.put("/:id", ClientInformationController.updateClientInformation)
	.delete("/:id", ClientInformationController.deleteClientInformation);
