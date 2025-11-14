import type { Blog } from "../types";

export function generateBlogJsonLd(blog: Blog, baseUrl: string): object {
	const blogUrl = `${baseUrl}/blog/${blog.slug}`;
	const imageUrl = blog.thumbnail || `${baseUrl}/preview.png`;

	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: blog.title,
		description: blog.excerpt || "",
		image: imageUrl,
		datePublished: new Date(blog.created_at).toISOString(),
		dateModified: new Date(blog.updated_at).toISOString(),
		author: {
			"@type": "Person",
			name: blog.author,
		},
		publisher: {
			"@type": "Organization",
			name: "Inkubator IT",
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": blogUrl,
		},
		articleBody: blog.excerpt || "",
	};
}