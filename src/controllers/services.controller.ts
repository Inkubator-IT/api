import type { Context } from "hono";
import { ServicesService } from "../services";
import type { CreateServiceRequest } from "../types";

export class ServicesController {
	static async getAllServices(c: Context) {
		try {
			const services = await ServicesService.getAllServices();
			return c.json({ success: true, data: services });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
		}
	}

	static async getServiceById(c: Context) {
		try {
			const serviceId = parseInt(c.req.param("id"), 10);
			const service = await ServicesService.getServiceById(serviceId);
			if (!service) {
				return c.json({ success: false, error: "Service not found" }, 404);
			}
			return c.json({ success: true, data: service });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
		}
	}

	static async createService(c: Context) {
		try {
			const data = await c.req.json() as CreateServiceRequest;
			const service = await ServicesService.createService(data);
			return c.json({ success: true, data: service }, 201);
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 400);
		}
	}

	static async updateService(c: Context) {
		try {
			const serviceId = parseInt(c.req.param("id"), 10);
			const data = await c.req.json() as Partial<CreateServiceRequest>;
			const service = await ServicesService.updateService(serviceId, data);
			if (!service) {
				return c.json({ success: false, error: "Service not found" }, 404);
			}
			return c.json({ success: true, data: service });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 400);
		}
	}

	static async deleteService(c: Context) {
		try {
			const serviceId = parseInt(c.req.param("id"), 10);
			const deleted = await ServicesService.deleteService(serviceId);
			if (!deleted) {
				return c.json({ success: false, error: "Service not found" }, 404);
			}
			return c.json({ success: true, message: "Service deleted successfully" });
		} catch (error) {
			return c.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, 500);
		}
	}
}
