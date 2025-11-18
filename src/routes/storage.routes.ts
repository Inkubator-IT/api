import { Hono } from "hono";
import { env, s3 } from "../configs";
import {
	storagePresignBodyValidator,
	storageReadBodyValidator,
} from "../validators/storage.validator";
import slugify from "slugify";

const ALLOWED_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/heic",
	"image/heif",
];

export const storageRoutes = new Hono();

const publicBaseUrl = env.S3_PUBLIC_BASE_URL.replace(/\/$/, "");
const buildPublicUrl = (key: string) =>
	`${publicBaseUrl}/${key.replace(/^\//, "")}`;

// POST /api/storage - Get presigned URL for upload
storageRoutes.post("/", storagePresignBodyValidator, async (c) => {
	const { fileName } = await c.req.json();

	const ext = fileName.substring(fileName.lastIndexOf("."));
	const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));

	const extToType: Record<string, string> = {
		".jpg": "image/jpeg",
		".jpeg": "image/jpeg",
		".png": "image/png",
		".webp": "image/webp",
		".heic": "image/heic",
		".heif": "image/heif",
	};

	const contentType = extToType[ext] ?? "";

	if (!ALLOWED_TYPES.includes(contentType)) {
		return c.json({ error: "Invalid file type" }, 400);
	}

	const sanitizedFileName = slugify(nameWithoutExt, {
		lower: true,
		strict: true,
		trim: true,
	}).substring(0, 100);

	const uuid = crypto.randomUUID();
	const key = `uploads/${sanitizedFileName}-${uuid}${ext}`;

	const uploadUrl = s3.presign(key, {
		expiresIn: 60 * 15, // 15 minutes
		method: "PUT",
		type: contentType,
	});

	const publicUrl = buildPublicUrl(key);

	return c.json({ url: uploadUrl, key, publicUrl, contentType });
});

// GET /api/storage - Get presigned URL for reading
storageRoutes.get("/", storageReadBodyValidator, async (c) => {
	const { key } = c.req.query();

	const publicUrl = buildPublicUrl(key);

	return c.json({ url: publicUrl });
});
