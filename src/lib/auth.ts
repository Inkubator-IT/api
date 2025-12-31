import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index";
import * as schema from "../db/schema";

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
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	trustedOrigins: getTrustedOrigins(),
	secret: Bun.env.BETTER_AUTH_SECRET,
	baseURL: Bun.env.BETTER_AUTH_URL,
});
