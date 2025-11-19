import type { Context, Next } from "hono";
import { auth } from "../lib/auth";

export async function requireAuth(c: Context, next: Next) {
	try {
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session) {
			return c.json(
				{
					success: false,
					error: "Unauthorized - Please sign in",
				},
				401,
			);
		}

		c.set("session", session);
		c.set("user", session.user);

		await next();
	} catch (error) {
		return c.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Authentication failed",
			},
			401,
		);
	}
}

export async function optionalAuth(c: Context, next: Next) {
	try {
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (session) {
			c.set("session", session);
			c.set("user", session.user);
		}

		await next();
	} catch (_error) {
		await next();
	}
}
