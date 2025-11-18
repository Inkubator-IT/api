import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";

export const db = drizzle(Bun.env.DATABASE_URL!, { schema });

export async function testConnection(): Promise<boolean> {
	try {
		await db.execute(sql`SELECT 1`);
		console.log("Database connection successful");
		return true;
	} catch (error) {
		console.error("Database connection failed:", error);
		return false;
	}
}
