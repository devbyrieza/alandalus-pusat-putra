import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SURAT_PENGUMUMAN_CONFIG } from "@/config/surat-pengumuman";
import { prisma } from "@/lib/prisma";
import {
  generateSuratPengumumanHasil,
  getNextNomorSurat,
  type AspekPenilaian,
} from "@/lib/surat/surat-pengumuman";

export const runtime = "nodejs";

async function checkSuperAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("al_session");
  if (!sessionCookie) return null;
  try {
    const session = JSON.parse(sessionCookie.value);
    return session.role === "admin_super" || session.role === "admin" ? session : null;
  } catch {
    return null;
  }
}

function parseAspek(body: any): AspekPenilaian[] {
  const raw = Array.isArray(body.aspek) ? body.aspek : [];
  return [0, 1, 2, 3, 4].map((i) => ({
    nilai: String(raw[i]?.nilai ?? "A").trim() || "A",
    keterangan: String(raw[i]?.keterangan ?? "").trim(),
  }));
}

/**
 * POST — generate DRAFT surat pengumuman kelulusan (belum final, nomor belum terkunci).
 * Body: { pendaftar_id, tanggal_terbit?, kelas_diterima?, gelombang?, hari_tanggal_tes?, virtual_account?, aspek? }
 * Return: { nomor_surat, kelas_diterima, tanggal_terbit, pdf_base64, filename }
 */
export async function POST(request: Request) {
  const admin = await checkSuperAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized. Hanya Admin." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const pendaftarId = body.pendaftar_id as string;
    if (!pendaftarId) {
      return NextResponse.json({ error: "pendaftar_id wajib." }, { status: 400 });
    }

    const pendaftar = await prisma.pendaftar.findFirst({
      where: { id: pendaftarId, deleted_at: null },
      select: {
        id: true,
        nama_lengkap: true,
        nomor_pendaftaran: true,
        jenjang: true,
      },
    });
    if (!pendaftar) {
      return NextResponse.json({ error: "Pendaftar tidak ditemukan." }, { status: 404 });
    }

    const tanggalTerbit = body.tanggal_terbit ? new Date(body.tanggal_terbit) : new Date();
    const kelasDiterima: string =
      body.kelas_diterima || SURAT_PENGUMUMAN_CONFIG.kelasDiterimaDefault;
    const gelombang: number = Number(body.gelombang) || SURAT_PENGUMUMAN_CONFIG.gelombangDefault;
    const jenjang: string = body.jenjang || SURAT_PENGUMUMAN_CONFIG.jenjangDefault;
    const hariTanggalTes: string =
      body.hari_tanggal_tes || "(hari/tanggal pelaksanaan tes)";
    const virtualAccount: string = String(body.virtual_account || "").trim();

    const { nomor } = await getNextNomorSurat(gelombang, tanggalTerbit);
    const { buffer, filename } = await generateSuratPengumumanHasil({
      nomorSurat: nomor,
      tanggalTerbit,
      namaLengkap: pendaftar.nama_lengkap,
      nomorPendaftaran: pendaftar.nomor_pendaftaran,
      jenjang,
      gelombang,
      hariTanggalTes,
      aspek: parseAspek(body),
      virtualAccount,
    });

    return NextResponse.json({
      nomor_surat: nomor,
      kelas_diterima: kelasDiterima,
      gelombang,
      jenjang,
      tanggal_terbit: tanggalTerbit.toISOString(),
      pdf_base64: buffer.toString("base64"),
      filename,
    });
  } catch (error: any) {
    console.error("POST /api/admin/surat-pengumuman/preview error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal generate draft surat" },
      { status: 500 }
    );
  }
}
