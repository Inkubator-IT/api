import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { testConnection } from "./db";
import {
	tagsRoutes,
	techStackRoutes,
	servicesRoutes,
	projectsRoutes,
	blogsRoutes,
	clientInformationRoutes,
	authRoutes,
	storageRoutes,
} from "./routes";

const app = new Hono();

const getAllowedOrigins = (): string[] => {
	const origins = Bun.env.CORS_ALLOWED_ORIGINS;
	if (origins) {
		return origins.split(",").map((origin) => origin.trim());
	}
	return [
		"http://localhost:5173",
		"http://localhost:5174",
		"http://localhost:3000",
	];
};

app.use(
	"*",
	cors({
		origin: getAllowedOrigins(),
		credentials: true,
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization", "X-User-Identifier"],
	}),
);

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
	} catch (error) {
		console.error("Database connection check failed:", error);
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
app.route("/api/auth", authRoutes);
app.route("/api/tags", tagsRoutes);
app.route("/api/tech-stack", techStackRoutes);
app.route("/api/services", servicesRoutes);
app.route("/api/projects", projectsRoutes);
app.route("/api/blogs", blogsRoutes);
app.route("/api/client-information", clientInformationRoutes);
app.route("/api/storage", storageRoutes);

// Initialize database on startup
async function initializeDatabase() {
	try {
		console.log("Initializing database...");
		await testConnection();
		console.log("Database initialized successfully");
	} catch (error) {
		console.error("Failed to initialize database:", error);
		process.exit(1);
	}
}

// Initialize database when the server starts
initializeDatabase();

export default {
	port: Bun.env.APP_PORT || 3000,
	fetch: app.fetch,
};
