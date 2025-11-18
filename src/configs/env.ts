import { z } from "zod";

const envSchema = z.object({
	APP_PORT: z.string().default("9000"),
	NODE_ENV: z.string().default("development"),
	DATABASE_URL: z.string(),
	S3_ACCESS_KEY_ID: z.string(),
	S3_SECRET_ACCESS_KEY: z.string(),
	S3_BUCKET: z.string(),
	S3_ENDPOINT: z.string(),
	S3_REGION: z.string(),
	S3_PUBLIC_BASE_URL: z.string().url(),
	CLOUDFLARE_DEPLOY_HOOK_URL: z.string().url().optional(),
});

export const env = envSchema.parse(Bun.env);
