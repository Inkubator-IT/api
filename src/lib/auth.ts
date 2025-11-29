import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: Bun.env.DATABASE_URL!,
});

const getTrustedOrigins = (): string[] => {
	const origins = Bun.env.AUTH_TRUSTED_ORIGINS;
	if (origins) {
		return origins.split(",").map((origin) => origin.trim());
	}
	return [
		"http://localhost:5173",
		"http://localhost:5174",
		"http://localhost:3000",
	];
};

export const auth = betterAuth({
	database: pool,
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	trustedOrigins: getTrustedOrigins(),
	secret: Bun.env.BETTER_AUTH_SECRET,
	baseURL: Bun.env.BETTER_AUTH_URL,
});
