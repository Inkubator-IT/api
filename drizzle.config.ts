import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		host: process.env.DB_HOST || "localhost",
		port: parseInt(process.env.DB_PORT || "5432"),
		user: process.env.POSTGRES_USER || "myuser",
		password: process.env.POSTGRES_PASSWORD || "mypassword",
		database: process.env.POSTGRES_DB || "mydb",
	},
});
