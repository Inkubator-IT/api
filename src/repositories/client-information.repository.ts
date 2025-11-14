import { sql } from "../db";
import type {
	ClientInformation,
	CreateClientInformationRequest,
} from "../types";

export class ClientInformationRepository {
	static async findAll(): Promise<ClientInformation[]> {
		return await sql<
			ClientInformation[]
		>`SELECT * FROM client_information ORDER BY created_at DESC`;
	}

	static async findById(id: number): Promise<ClientInformation | null> {
		const result = await sql<
			ClientInformation[]
		>`SELECT * FROM client_information WHERE id = ${id}`;
		return result[0] || null;
	}

	static async create(
		data: CreateClientInformationRequest,
	): Promise<ClientInformation> {
		const result = await sql<ClientInformation[]>`
			INSERT INTO client_information (
				nama_lengkap, email, no_whatsapp, instansi, civitas_itb, jenis_proyek,
				tujuan_pembuatan_proyek, deskripsi_proyek, ekspetasi_biaya, deadline_proyek,
				sudah_memiliki_desain, pertanyaan_untuk_proyek, dimana_mengetahui_iit,
				rating_website, masukan_website, kode_promo
			)
			VALUES (
				${data.nama_lengkap}, ${data.email}, ${data.no_whatsapp}, ${data.instansi}, ${data.civitas_itb}, ${data.jenis_proyek},
				${data.tujuan_pembuatan_proyek}, ${data.deskripsi_proyek}, ${data.ekspetasi_biaya}, ${data.deadline_proyek},
				${data.sudah_memiliki_desain}, ${data.pertanyaan_untuk_proyek}, ${data.dimana_mengetahui_iit},
				${data.rating_website}, ${data.masukan_website}, ${data.kode_promo}
			)
			RETURNING *
		`;
		return result[0];
	}

	static async update(
		id: number,
		data: Partial<CreateClientInformationRequest>,
	): Promise<ClientInformation | null> {
		const result = await sql<ClientInformation[]>`
			UPDATE client_information 
			SET nama_lengkap = COALESCE(${data.nama_lengkap}, nama_lengkap),
				email = COALESCE(${data.email}, email),
				no_whatsapp = COALESCE(${data.no_whatsapp}, no_whatsapp),
				instansi = COALESCE(${data.instansi}, instansi),
				civitas_itb = COALESCE(${data.civitas_itb}, civitas_itb),
				jenis_proyek = COALESCE(${data.jenis_proyek}, jenis_proyek),
				tujuan_pembuatan_proyek = COALESCE(${data.tujuan_pembuatan_proyek}, tujuan_pembuatan_proyek),
				deskripsi_proyek = COALESCE(${data.deskripsi_proyek}, deskripsi_proyek),
				ekspetasi_biaya = COALESCE(${data.ekspetasi_biaya}, ekspetasi_biaya),
				deadline_proyek = COALESCE(${data.deadline_proyek}, deadline_proyek),
				sudah_memiliki_desain = COALESCE(${data.sudah_memiliki_desain}, sudah_memiliki_desain),
				pertanyaan_untuk_proyek = COALESCE(${data.pertanyaan_untuk_proyek}, pertanyaan_untuk_proyek),
				dimana_mengetahui_iit = COALESCE(${data.dimana_mengetahui_iit}, dimana_mengetahui_iit),
				rating_website = COALESCE(${data.rating_website}, rating_website),
				masukan_website = COALESCE(${data.masukan_website}, masukan_website),
				kode_promo = COALESCE(${data.kode_promo}, kode_promo),
				updated_at = CURRENT_TIMESTAMP
			WHERE id = ${id}
			RETURNING *
		`;
		return result[0] || null;
	}

	static async delete(id: number): Promise<boolean> {
		const result = await sql`DELETE FROM client_information WHERE id = ${id}`;
		return result.count > 0;
	}
}
