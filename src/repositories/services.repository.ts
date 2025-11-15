import { db } from "../db";
import { services } from "../db/schema";
import { eq, asc } from "drizzle-orm";
import type { Service, CreateServiceRequest } from "../types";

export class ServicesRepository {
	static async findAll(): Promise<Service[]> {
		return await db.select().from(services).orderBy(asc(services.service_name)) as unknown as Service[];
	}

	static async findById(serviceId: number): Promise<Service | null> {
		const result = await db.select().from(services).where(eq(services.service_id, serviceId));
		return (result[0] as unknown as Service) || null;
	}

	static async create(data: CreateServiceRequest): Promise<Service> {
		const result = await db.insert(services).values({
			service_name: data.service_name,
			service_description: data.service_description,
		}).returning();
		return result[0] as unknown as Service;
	}

	static async update(serviceId: number, data: Partial<CreateServiceRequest>): Promise<Service | null> {
		const updateData: any = {};

		if (data.service_name !== undefined) updateData.service_name = data.service_name;
		if (data.service_description !== undefined) updateData.service_description = data.service_description;

		updateData.updated_at = new Date();

		const result = await db
			.update(services)
			.set(updateData)
			.where(eq(services.service_id, serviceId))
			.returning();

		return (result[0] as unknown as Service) || null;
	}

	static async delete(serviceId: number): Promise<boolean> {
		const result = await db.delete(services).where(eq(services.service_id, serviceId)).returning();
		return result.length > 0;
	}
}
