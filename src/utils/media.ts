import { env } from "../configs";

const publicBaseUrl = env.S3_PUBLIC_BASE_URL.replace(/\/$/, "");

export const isPublicUrl = (value?: string | null) =>
	!!value && /^https?:\/\//i.test(value);

export const toPublicUrl = (value?: string | null) => {
	if (!value) return value;
	if (isPublicUrl(value)) return value;

	const normalizedKey = value.replace(/^\//, "");
	return `${publicBaseUrl}/${normalizedKey}`;
};

export const mapMediaArray = (items?: string[] | null) => {
	if (!items || items.length === 0) {
		return items ?? [];
	}

	return items.map((item) => toPublicUrl(item) ?? item);
};
