import { queryClient, closeConnection } from "./index";

async function dropOldTables(): Promise<void> {
	console.log("Dropping old tables...");

	await queryClient`DROP TABLE IF EXISTS blog_likes CASCADE`;
	await queryClient`DROP TABLE IF EXISTS client_information CASCADE`;
	await queryClient`DROP TABLE IF EXISTS blogs CASCADE`;
	await queryClient`DROP TABLE IF EXISTS project_tech_stack CASCADE`;
	await queryClient`DROP TABLE IF EXISTS projects CASCADE`;
	await queryClient`DROP TABLE IF EXISTS services CASCADE`;
	await queryClient`DROP TABLE IF EXISTS tech_stack CASCADE`;
	await queryClient`DROP TABLE IF EXISTS tags CASCADE`;

	console.log("Old tables dropped successfully");
}

async function runMigration(): Promise<void> {
	try {
		console.log("Starting database migration to Drizzle...");

		console.log("Testing database connection...");
		await queryClient`SELECT 1`;
		console.log("Database connected successfully");

		// Drop old tables
		await dropOldTables();

		console.log("\n✅ Migration preparation complete!");
		console.log("\nNext steps:");
		console.log("1. Run: bun run db:push");
		console.log("   This will create all tables with Drizzle schema");
		console.log("\n2. Run: bun run dev");
		console.log("   Start your API server\n");

		process.exit(0);
	} catch (error) {
		console.error("Database migration failed:", error);
		process.exit(1);
	} finally {
		await closeConnection();
	}
}

runMigration();

