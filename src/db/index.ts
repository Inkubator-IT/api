import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = Bun.env.DATABASE_URL || "postgresql://myuser:mypassword@localhost:5432/mydb";

export const queryClient = postgres(connectionString);

export const db = drizzle(queryClient, { schema });

export async function testConnection(): Promise<boolean> {
	try {
		await queryClient`SELECT 1`;
		console.log("Database connection successful");
		return true;
	} catch (error) {
		console.error("Database connection failed:", error);
		return false;
	}
}

export async function closeConnection(): Promise<void> {
	await queryClient.end();
}