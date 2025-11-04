import { ServicesRepository } from "../repositories";
import type { Service, CreateServiceRequest } from "../types";

export class ServicesService {
	static async getAllServices(): Promise<Service[]> {
		return await ServicesRepository.findAll();
	}

	static async getServiceById(serviceId: number): Promise<Service | null> {
		if (!serviceId || serviceId <= 0) {
			throw new Error("Invalid service ID");
		}
		return await ServicesRepository.findById(serviceId);
	}

	static async createService(data: CreateServiceRequest): Promise<Service> {
		if (!data.service_name || data.service_name.trim().length === 0) {
			throw new Error("Service name is required");
		}
		return await ServicesRepository.create(data);
	}

	static async updateService(
		serviceId: number,
		data: Partial<CreateServiceRequest>,
	): Promise<Service | null> {
		if (!serviceId || serviceId <= 0) {
			throw new Error("Invalid service ID");
		}
		return await ServicesRepository.update(serviceId, data);
	}

	static async deleteService(serviceId: number): Promise<boolean> {
		if (!serviceId || serviceId <= 0) {
			throw new Error("Invalid service ID");
		}
		return await ServicesRepository.delete(serviceId);
	}
}
