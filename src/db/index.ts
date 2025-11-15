import postgres from "postgres";

const connectionString = Bun.env.DATABASE_URL || "postgresql://myuser:mypassword@localhost:5432/mydb";

export const sql = postgres(connectionString, {
	host: Bun.env.DB_HOST || "localhost",
	port: parseInt(Bun.env.DB_PORT || "5432", 10),
	username: Bun.env.POSTGRES_USER || "myuser",
	password: Bun.env.POSTGRES_PASSWORD || "mypassword",
	database: Bun.env.POSTGRES_DB || "mydb",
});

export async function testConnection(): Promise<boolean> {
	try {
		await sql`SELECT 1`;
		console.log("Database connection successful");
		return true;
	} catch (error) {
		console.error("Database connection failed:", error);
		return false;
	}
}

export async function closeConnection(): Promise<void> {
	await sql.end();
}

// export { createTables, dropTables } from "./schema";

// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import * as schema from "./schema";

// const connectionString = Bun.env.DATABASE_URL || "postgresql://myuser:mypassword@localhost:5432/mydb";

// export const queryClient = postgres(connectionString, {
//   host: Bun.env.DB_HOST || "localhost",
//   port: parseInt(Bun.env.DB_PORT || "5432", 10),
//   username: Bun.env.POSTGRES_USER || "myuser",
//   password: Bun.env.POSTGRES_PASSWORD || "mypassword",
//   database: Bun.env.POSTGRES_DB || "mydb",
// });

// export const db = drizzle(queryClient, { schema });

// export async function testConnection(): Promise<boolean> {
//   try {
//     await queryClient`SELECT 1`;
//     console.log("Database connection successful");
//     return true;
//   } catch (error) {
//     console.error("Database connection failed:", error);
//     return false;
//   }
// }

// export async function closeConnection(): Promise<void> {
//   await queryClient.end();
// }