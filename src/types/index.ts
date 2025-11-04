export interface Project {
	id: number;
	title: string;
	description: string;
	owner: string;
	url: string;
	tag_id: number;
	tech_stack_id: number;
	testimonial: string;
	created_at: Date;
	updated_at: Date;
}

export interface Tag {
	tag_id: number;
	tag_name: string;
	tag_description: string;
	created_at: Date;
	updated_at: Date;
}

export interface TechStack {
	tech_stack_id: number;
	tech_stack_name: string;
	tech_stack_description: string;
	created_at: Date;
	updated_at: Date;
}

export type ContentBlockType = "paragraph" | "header" | "quote";

export interface ContentBlock {
	type: ContentBlockType;
	text: string;
}

export interface Blog {
	id: number;
	title: string;
	author: string;
	slug: string;
	excerpt: string;
	thumbnail: string;
	content: ContentBlock[]; // Structured content blocks
	time_read: string;
	tag_id: number;
	tag?: {
		tag_id: number;
		tag_name: string;
		tag_description: string;
	};
	created_at: Date;
	updated_at: Date;
}

export interface Service {
	service_id: number;
	service_name: string;
	service_description: string;
	created_at: Date;
	updated_at: Date;
}

export interface ClientInformation {
	id: number;
	nama_lengkap: string;
	email: string;
	no_whatsapp: string;
	instansi: string;
	civitas_itb: boolean;
	jenis_proyek: string;
	tujuan_pembuatan_proyek: string;
	deskripsi_proyek: string;
	ekspetasi_biaya: string;
	deadline_proyek: string;
	sudah_memiliki_desain: boolean;
	pertanyaan_untuk_proyek: string;
	dimana_mengetahui_iit: string;
	rating_website: number;
	masukan_website: string;
	kode_promo: string;
	created_at: Date;
	updated_at: Date;
}

// Request/Response DTOs
export interface CreateProjectRequest {
	title: string;
	description: string;
	owner: string;
	url: string;
	tag_id: number;
	tech_stack_id: number;
	testimonial: string;
}

export interface CreateTagRequest {
	tag_name: string;
	tag_description: string;
}

export interface CreateTechStackRequest {
	tech_stack_name: string;
	tech_stack_description: string;
}

export interface CreateBlogRequest {
	title: string;
	author: string;
	slug: string;
	excerpt: string;
	thumbnail: string;
	content: ContentBlock[];
	time_read: string;
	tag_id: number;
}

export interface CreateServiceRequest {
	service_name: string;
	service_description: string;
}

export interface CreateClientInformationRequest {
	nama_lengkap: string;
	email: string;
	no_whatsapp: string;
	instansi: string;
	civitas_itb: boolean;
	jenis_proyek: string;
	tujuan_pembuatan_proyek: string;
	deskripsi_proyek: string;
	ekspetasi_biaya: string;
	deadline_proyek: string;
	sudah_memiliki_desain: boolean;
	pertanyaan_untuk_proyek: string;
	dimana_mengetahui_iit: string;
	rating_website: number;
	masukan_website: string;
	kode_promo: string;
}
