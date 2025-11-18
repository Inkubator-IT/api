import { env } from "../configs/env";

export async function triggerDeployHook(event: string) {
	const hookUrl = env.CLOUDFLARE_DEPLOY_HOOK_URL;

	if (!hookUrl) {
		return;
	}

	try {
		const response = await fetch(hookUrl, {
			method: "POST",
		});

		if (!response.ok) {
			const body = await response.text().catch(() => "");
			console.error(
				`Failed to trigger deploy hook for ${event}: ${response.status} ${response.statusText} ${body}`,
			);
		}
	} catch (error) {
		console.error(`Error triggering deploy hook for ${event}:`, error);
	}
}
