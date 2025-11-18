import { z } from "zod";
import type { Context, Next } from "hono";

const storagePresignBodySchema = z.object({
	fileName: z.string().min(1, "File name is required"),
});

const storageReadBodySchema = z.object({
	key: z.string().min(1, "Key is required"),
});

export const storagePresignBodyValidator = async (c: Context, next: Next) => {
	try {
		const body = await c.req.json();
		storagePresignBodySchema.parse(body);
		await next();
	} catch (error) {
		return c.json({ error: "Invalid request body" }, 400);
	}
};

export const storageReadBodyValidator = async (c: Context, next: Next) => {
	try {
		const query = c.req.query();
		storageReadBodySchema.parse(query);
		await next();
	} catch (error) {
		return c.json({ error: "Invalid query parameters" }, 400);
	}
};
