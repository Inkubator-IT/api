import { ClientInformationRepository } from "../repositories";
import type {
	ClientInformation,
	CreateClientInformationRequest,
} from "../types";

export class ClientInformationService {
	static async getAllClientInformation(): Promise<ClientInformation[]> {
		return await ClientInformationRepository.findAll();
	}

	static async getClientInformationById(
		id: number,
	): Promise<ClientInformation | null> {
		if (!id || id <= 0) {
			throw new Error("Invalid client information ID");
		}
		return await ClientInformationRepository.findById(id);
	}

	static async createClientInformation(
		data: CreateClientInformationRequest,
	): Promise<ClientInformation> {
		if (!data.nama_lengkap || data.nama_lengkap.trim().length === 0) {
			throw new Error("Nama lengkap is required");
		}
		if (!data.email || data.email.trim().length === 0) {
			throw new Error("Email is required");
		}
		if (!data.email.includes("@")) {
			throw new Error("Invalid email format");
		}
		if (
			data.rating_website &&
			(data.rating_website < 1 || data.rating_website > 5)
		) {
			throw new Error("Rating must be between 1 and 5");
		}
		return await ClientInformationRepository.create(data);
	}

	static async updateClientInformation(
		id: number,
		data: Partial<CreateClientInformationRequest>,
	): Promise<ClientInformation | null> {
		if (!id || id <= 0) {
			throw new Error("Invalid client information ID");
		}
		if (data.email && !data.email.includes("@")) {
			throw new Error("Invalid email format");
		}
		if (
			data.rating_website &&
			(data.rating_website < 1 || data.rating_website > 5)
		) {
			throw new Error("Rating must be between 1 and 5");
		}
		return await ClientInformationRepository.update(id, data);
	}

	static async deleteClientInformation(id: number): Promise<boolean> {
		if (!id || id <= 0) {
			throw new Error("Invalid client information ID");
		}
		return await ClientInformationRepository.delete(id);
	}
}
