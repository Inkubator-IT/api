import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { testConnection, createTables } from "./db";
import {
	tagsRoutes,
	techStackRoutes,
	servicesRoutes,
	projectsRoutes,
	blogsRoutes,
	clientInformationRoutes,
	testimonialsRoutes,
} from "./routes";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger());

// Health check endpoint
app.get("/", (c) => {
	return c.json({
		success: true,
		message: "IIT API Server is running!",
		timestamp: new Date().toISOString(),
	});
});

// Health check for database
app.get("/health", async (c) => {
	try {
		const isConnected = await testConnection();
		return c.json({
			success: true,
			database: isConnected ? "connected" : "disconnected",
			timestamp: new Date().toISOString(),
		});
	} catch (_error) {
		return c.json(
			{
				success: false,
				error: "Database connection failed",
				timestamp: new Date().toISOString(),
			},
			500,
		);
	}
});

// Register routes
app.route("/api/tags", tagsRoutes);
app.route("/api/tech-stack", techStackRoutes);
app.route("/api/services", servicesRoutes);
app.route("/api/projects", projectsRoutes);
app.route("/api/blogs", blogsRoutes);
app.route("/api/client-information", clientInformationRoutes);
app.route("/api/testimonials", testimonialsRoutes);

// Initialize database on startup
async function initializeDatabase() {
	try {
		console.log("Initializing database...");
		await testConnection();
		await createTables();
		console.log("Database initialized successfully");
	} catch (error) {
		console.error("Failed to initialize database:", error);
		process.exit(1);
	}
}

// Initialize database when the server starts
initializeDatabase();

export default {
	port: Bun.env.APP_PORT || 4000,
	fetch: app.fetch,
};
