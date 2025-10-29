import type { Context } from "hono";
import { ClientInformationService } from "../services";
import type { CreateClientInformationRequest } from "../types";

export class ClientInformationController {
	static async getAllClientInformation(c: Context) {
		try {
			const clientInfo = await ClientInformationService.getAllClientInformation();
			return c.json({ success: true, data: clientInfo });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
		}
	}

	static async getClientInformationById(c: Context) {
		try {
			const id = parseInt(c.req.param("id"), 10);
			const clientInfo = await ClientInformationService.getClientInformationById(id);
			if (!clientInfo) {
				return c.json({ success: false, error: "Client information not found" }, 404);
			}
			return c.json({ success: true, data: clientInfo });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
		}
	}

	static async createClientInformation(c: Context) {
		try {
			const data = await c.req.json() as CreateClientInformationRequest;
			const clientInfo = await ClientInformationService.createClientInformation(data);
			return c.json({ success: true, data: clientInfo }, 201);
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 400);
		}
	}

	static async updateClientInformation(c: Context) {
		try {
			const id = parseInt(c.req.param("id"), 10);
			const data = await c.req.json() as Partial<CreateClientInformationRequest>;
			const clientInfo = await ClientInformationService.updateClientInformation(id, data);
			if (!clientInfo) {
				return c.json({ success: false, error: "Client information not found" }, 404);
			}
			return c.json({ success: true, data: clientInfo });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 400);
		}
	}

	static async deleteClientInformation(c: Context) {
		try {
			const id = parseInt(c.req.param("id"), 10);
			const deleted = await ClientInformationService.deleteClientInformation(id);
			if (!deleted) {
				return c.json({ success: false, error: "Client information not found" }, 404);
			}
			return c.json({ success: true, message: "Client information deleted successfully" });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
		}
	}
}
