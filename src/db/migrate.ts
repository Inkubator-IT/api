import { testConnection, createTables, closeConnection } from "./index";

async function runMigration(): Promise<void> {
	try {
		console.log("Starting database migration...");

		console.log("Testing database connection...");
		const isConnected = await testConnection();
		if (!isConnected) {
			throw new Error("Database connection failed");
		}

		console.log("Running migrations...");
		await createTables();

		console.log("Database migration completed successfully");
		process.exit(0);
	} catch (error) {
		console.error("Database migration failed:", error);
		process.exit(1);
	} finally {
		await closeConnection();
	}
}

runMigration();

