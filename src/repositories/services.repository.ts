import { sql } from "../db";
import type { Service, CreateServiceRequest } from "../types";

export class ServicesRepository {
	static async findAll(): Promise<Service[]> {
		return await sql<Service[]>`SELECT * FROM services ORDER BY service_name`;
	}

	static async findById(serviceId: number): Promise<Service | null> {
		const result = await sql<
			Service[]
		>`SELECT * FROM services WHERE service_id = ${serviceId}`;
		return result[0] || null;
	}

	static async create(data: CreateServiceRequest): Promise<Service> {
		const result = await sql<Service[]>`
			INSERT INTO services (service_name, service_description)
			VALUES (${data.service_name}, ${data.service_description})
			RETURNING *
		`;
		return result[0];
	}

	static async update(
		serviceId: number,
		data: Partial<CreateServiceRequest>,
	): Promise<Service | null> {
		const result = await sql<Service[]>`
			UPDATE services 
			SET service_name = COALESCE(${data.service_name}, service_name),
				service_description = COALESCE(${data.service_description}, service_description),
				updated_at = CURRENT_TIMESTAMP
			WHERE service_id = ${serviceId}
			RETURNING *
		`;
		return result[0] || null;
	}

	static async delete(serviceId: number): Promise<boolean> {
		const result =
			await sql`DELETE FROM services WHERE service_id = ${serviceId}`;
		return result.count > 0;
	}
}
