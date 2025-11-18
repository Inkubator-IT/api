import { db } from "../db";
import { clientInformation } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import type {
	ClientInformation,
	CreateClientInformationRequest,
} from "../types";

export class ClientInformationRepository {
	static async findAll(): Promise<ClientInformation[]> {
		return (await db
			.select()
			.from(clientInformation)
			.orderBy(
				desc(clientInformation.created_at),
			)) as unknown as ClientInformation[];
	}

	static async findById(id: number): Promise<ClientInformation | null> {
		const result = await db
			.select()
			.from(clientInformation)
			.where(eq(clientInformation.id, id));
		return (result[0] as unknown as ClientInformation) || null;
	}

	static async create(
		data: CreateClientInformationRequest,
	): Promise<ClientInformation> {
		const result = await db
			.insert(clientInformation)
			.values({
				nama_lengkap: data.nama_lengkap,
				email: data.email,
				no_whatsapp: data.no_whatsapp,
				instansi: data.instansi,
				civitas_itb: data.civitas_itb,
				jenis_proyek: data.jenis_proyek,
				tujuan_pembuatan_proyek: data.tujuan_pembuatan_proyek,
				deskripsi_proyek: data.deskripsi_proyek,
				ekspetasi_biaya: data.ekspetasi_biaya,
				deadline_proyek: data.deadline_proyek,
				sudah_memiliki_desain: data.sudah_memiliki_desain,
				pertanyaan_untuk_proyek: data.pertanyaan_untuk_proyek,
				dimana_mengetahui_iit: data.dimana_mengetahui_iit,
				rating_website: data.rating_website,
				masukan_website: data.masukan_website,
				kode_promo: data.kode_promo,
			})
			.returning();
		return result[0] as unknown as ClientInformation;
	}

	static async update(
		id: number,
		data: Partial<CreateClientInformationRequest>,
	): Promise<ClientInformation | null> {
		const updateData: any = {};

		if (data.nama_lengkap !== undefined)
			updateData.nama_lengkap = data.nama_lengkap;
		if (data.email !== undefined) updateData.email = data.email;
		if (data.no_whatsapp !== undefined)
			updateData.no_whatsapp = data.no_whatsapp;
		if (data.instansi !== undefined) updateData.instansi = data.instansi;
		if (data.civitas_itb !== undefined)
			updateData.civitas_itb = data.civitas_itb;
		if (data.jenis_proyek !== undefined)
			updateData.jenis_proyek = data.jenis_proyek;
		if (data.tujuan_pembuatan_proyek !== undefined)
			updateData.tujuan_pembuatan_proyek = data.tujuan_pembuatan_proyek;
		if (data.deskripsi_proyek !== undefined)
			updateData.deskripsi_proyek = data.deskripsi_proyek;
		if (data.ekspetasi_biaya !== undefined)
			updateData.ekspetasi_biaya = data.ekspetasi_biaya;
		if (data.deadline_proyek !== undefined)
			updateData.deadline_proyek = data.deadline_proyek;
		if (data.sudah_memiliki_desain !== undefined)
			updateData.sudah_memiliki_desain = data.sudah_memiliki_desain;
		if (data.pertanyaan_untuk_proyek !== undefined)
			updateData.pertanyaan_untuk_proyek = data.pertanyaan_untuk_proyek;
		if (data.dimana_mengetahui_iit !== undefined)
			updateData.dimana_mengetahui_iit = data.dimana_mengetahui_iit;
		if (data.rating_website !== undefined)
			updateData.rating_website = data.rating_website;
		if (data.masukan_website !== undefined)
			updateData.masukan_website = data.masukan_website;
		if (data.kode_promo !== undefined) updateData.kode_promo = data.kode_promo;

		updateData.updated_at = new Date();

		const result = await db
			.update(clientInformation)
			.set(updateData)
			.where(eq(clientInformation.id, id))
			.returning();

		return (result[0] as unknown as ClientInformation) || null;
	}

	static async delete(id: number): Promise<boolean> {
		const result = await db
			.delete(clientInformation)
			.where(eq(clientInformation.id, id))
			.returning();
		return result.length > 0;
	}
}
