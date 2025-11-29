import type { Context } from "hono";
import { auth } from "../lib/auth";

export class AuthController {
	static async handleAuth(c: Context) {
		return auth.handler(c.req.raw);
	}

	static async getSession(c: Context) {
		try {
			const session = await auth.api.getSession({
				headers: c.req.raw.headers,
			});

			if (!session) {
				return c.json({ success: false, error: "Not authenticated" }, 401);
			}

			return c.json({ success: true, data: session });
		} catch (error) {
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				},
				500,
			);
		}
	}

	static async getUser(c: Context) {
		try {
			const session = await auth.api.getSession({
				headers: c.req.raw.headers,
			});

			if (!session) {
				return c.json({ success: false, error: "Not authenticated" }, 401);
			}

			return c.json({ success: true, data: session.user });
		} catch (error) {
			return c.json(
				{
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				},
				500,
			);
		}
	}
}
