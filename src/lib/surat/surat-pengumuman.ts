/**
 * Surat Pengumuman Kelulusan PSB — generator PDF (server-side).
 * Format nomor: <SEQ3>/PSB/G<GELOMBANG>/<ROMAWI-BULAN>/<TA-COMPACT>
 * SEQ urut angka 3 digit (001, 002, ...).
 *
 * Teknik template: background JPEG halaman resmi (zona variabel dikosongkan,
 * commit sebagai public/images/template-surat-pengumuman-1..3.jpg) + overlay
 * teks jsPDF. Koordinat zona dalam pt (halaman 595.2 x 841.92), y diukur
 * pdf.js dari BAWAH halaman (baseline) — dikonversi ke jsPDF (dari ATAS).
 */
import { jsPDF } from "jspdf";
import { SURAT_PENGUMUMAN_CONFIG as CFG } from "@/config/surat-pengumuman";
import { prisma } from "@/lib/prisma";

const BULAN_ROMAWI = [
  "I", "II", "III", "IV", "V", "VI",
  "VII", "VIII", "IX", "X", "XI", "XII",
] as const;

// ============ PENOMORAN ============

export function buildNomorSurat(seq: number, gelombang: number, tanggal: Date): string {
  const bulan = BULAN_ROMAWI[tanggal.getMonth()];
  const seqStr = String(seq).padStart(3, "0");
  return `${seqStr}/${CFG.nomorSuffix}/G${gelombang}/${bulan}/${CFG.taCompact}`;
}

/** SEQ dari nomor surat lengkap, atau null jika format beda. */
export function parseNomorSurat(nomor: string): { seq: number; gelombang: number } | null {
  const m = nomor.match(/^(\d{3})\/PSB\/G(\d+)\/([IVX]+)\/(\d{4})$/);
  if (!m) return null;
  return { seq: parseInt(m[1], 10), gelombang: parseInt(m[2], 10) };
}

/** Ambil semua SEQ yang sudah terpakai: dari pengumuman + baseline manual di app_settings. */
export async function getSeqTerpakai(): Promise<number[]> {
  const rows = await prisma.pengumuman.findMany({
    where: { nomor_surat: { not: null } },
    select: { nomor_surat: true },
  });
  const seqs: number[] = [];
  for (const r of rows) {
    const parsed = parseNomorSurat(r.nomor_surat!);
    if (parsed) seqs.push(parsed.seq);
  }
  // Surat yang terbit MANUAL sebelum fitur ini dicatat sebagai baseline
  // di app_settings: key "surat_nomor_terakhir" (nomor lengkap terakhir).
  const setting = await prisma.appSetting.findUnique({
    where: { key: "surat_nomor_terakhir" },
  });
  if (setting) {
    const parsed = parseNomorSurat(setting.value);
    if (parsed) seqs.push(parsed.seq);
  }
  return seqs;
}

/** Nomor surat berikutnya (SEQ > max terpakai, anti lompat). Tidak mengunci — finalisasi memverifikasi ulang + unique constraint. */
export async function getNextNomorSurat(
  gelombang: number,
  tanggal: Date
): Promise<{ seq: number; nomor: string }> {
  const terpakai = await getSeqTerpakai();
  let seq = terpakai.length ? Math.max(...terpakai) + 1 : 1;
  const max = 999;
  while (seq <= max) {
    const nomor = buildNomorSurat(seq, gelombang, tanggal);
    const ada = await prisma.pengumuman.findUnique({ where: { nomor_surat: nomor } });
    if (!ada) return { seq, nomor };
    seq++;
  }
  throw new Error("Nomor surat untuk tahun ajaran ini sudah habis (melebihi 999).");
}

// ============ GENERATOR PDF ============

export interface AspekPenilaian {
  nilai: string; // A / B / C / D
  keterangan: string;
}

export interface SuratPengumumanData {
  nomorSurat: string;
  tanggalTerbit: Date; // UTC
  namaLengkap: string;
  nomorPendaftaran: string;
  jenjang: string;
  gelombang: number;
  hariTanggalTes: string; // mis. "Sabtu, 10 Oktober 2026"
  aspek: AspekPenilaian[]; // 5 baris tabel
  virtualAccount: string;
}

const imageCache: Record<string, string | null> = {};

async function loadImage(path: string): Promise<string | null> {
  if (!path) return null;
  if (imageCache[path] !== undefined) return imageCache[path];
  try {
    const fs = await import("fs/promises");
    const pathMod = await import("path");
    const filePath = pathMod.join(process.cwd(), "public", path);
    const data = await fs.readFile(filePath);
    const ext = pathMod.extname(path).slice(1).toLowerCase() || "png";
    const mime = ext === "jpg" || ext === "jpeg" ? "jpeg" : "png";
    imageCache[path] = `data:image/${mime};base64,${data.toString("base64")}`;
  } catch {
    imageCache[path] = null;
  }
  return imageCache[path];
}

function tanggalIndo(d: Date): string {
  // Gunakan WIB (UTC+7) sebagai tanggal terbit resmi
  const wib = new Date(d.getTime() + 7 * 3600 * 1000);
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${wib.getUTCDate()} ${bulan[wib.getUTCMonth()]} ${wib.getUTCFullYear()}`;
}

/**
 * Posisi zona variabel pada template resmi (pt, page 595.2 x 841.92).
 * y diukur pdf.js dari BAWAH halaman (baseline) — dikonversi ke jsPDF (dari ATAS).
 */
const TEMPLATE_PAGE = { w: 595.2, h: 841.92 };
const Y = (yBottom: number) => TEMPLATE_PAGE.h - yBottom;
const ZONA = {
  kopTa: { x: 122.69, y: Y(725.5), fs: 12 },
  tanggal: { x: 538.9, y: Y(689.71), fs: 11, alignRight: true },
  nomor: { x: 128.69, y: Y(675.07), fs: 11 },
  nama: { x: 56.66, y: Y(594.41), fs: 11 },
  jenjangLine: { x: 56.66, y: Y(579.77), fs: 11 },
  introL1: { x: 92.69, y: Y(513.74), fs: 11 },
  introL2: { x: 56.66, y: Y(499.1), fs: 11 },
  footerTa: { x: 344.78, y: Y(134.69), fs: 11 },
  // Tabel nilai (hal 1)
  nilaiX: 240.58,
  nilaiBaseY: [457.32, 419.16, 381.22, 363.7, 318.34],
  ketX: 274.9,
  ketBaseY: [457.32, 441, 381.22, 363.7, 347.38], // baseline baris pertama tiap row
  ketLineHeight: 14.4,
  ketMaxLines: [1, 4, 1, 1, 5],
  // Hal 2
  va: { x: 278.98, y: Y(611.21), fs: 11 },
};

async function generateSuratDariTemplate(
  data: SuratPengumumanData
): Promise<{ buffer: Buffer; filename: string }> {
  const doc = new jsPDF({
    unit: "pt",
    format: [TEMPLATE_PAGE.w, TEMPLATE_PAGE.h],
  });

  const tampil = async (page: number) => {
    if (page > 1) doc.addPage([TEMPLATE_PAGE.w, TEMPLATE_PAGE.h]);
    const img = await loadImage(`/images/template-surat-pengumuman-${page}.jpg`);
    if (img) doc.addImage(img, "JPEG", 0, 0, TEMPLATE_PAGE.w, TEMPLATE_PAGE.h);
  };

  const tulis = (
    text: string,
    zona: { x: number; y: number; fs: number; alignRight?: boolean },
    bold = false
  ) => {
    doc.setFont("times", bold ? "bold" : "normal");
    doc.setFontSize(zona.fs);
    doc.text(text, zona.x, zona.y, zona.alignRight ? { align: "right" } : undefined);
  };

  const tulisWrap = (
    text: string,
    x: number,
    yBottomStart: number,
    maxLines: number,
    bold = false
  ) => {
    doc.setFont("times", bold ? "bold" : "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(text, 263).slice(0, maxLines);
    lines.forEach((line: string, i: number) => {
      doc.text(line, x, Y(yBottomStart - i * ZONA.ketLineHeight));
    });
  };

  // ===== HALAMAN 1 =====
  await tampil(1);

  tulis(`Tahun Ajaran 2027-2028`, ZONA.kopTa);
  tulis(`${CFG.kota}, ${tanggalIndo(data.tanggalTerbit)}`, ZONA.tanggal);
  tulis(`: ${data.nomorSurat}`, ZONA.nomor);
  tulis(data.namaLengkap, ZONA.nama);
  tulis(`Jenjang ${data.jenjang}, Nomor Tes ${data.nomorPendaftaran}`, ZONA.jenjangLine);
  tulis(
    `Kami menginformasikan hasil Tes Seleksi Penerimaan Santri Baru Tahun Ajaran`,
    ZONA.introL1
  );
  tulis(
    `2027-2028 Gelombang ke-${data.gelombang} yang dilaksanakan pada hari ${data.hariTanggalTes}, sebagai berikut:`,
    ZONA.introL2
  );

  const aspek = data.aspek;
  for (let i = 0; i < 5; i++) {
    const nilai = aspek[i]?.nilai ?? "";
    const ket = aspek[i]?.keterangan ?? "";
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text(nilai, ZONA.nilaiX, Y(ZONA.nilaiBaseY[i]));
    tulisWrap(ket, ZONA.ketX, ZONA.ketBaseY[i], ZONA.ketMaxLines[i]);
  }

  tulis(`Panitia PSB 2027-2028`, ZONA.footerTa);

  // ===== HALAMAN 2 (lampiran tata cara daftar ulang — nomor VA variabel) =====
  await tampil(2);
  tulis(data.virtualAccount, ZONA.va);

  // ===== HALAMAN 3 (infografis pembayaran — statis) =====
  await tampil(3);

  const filename = `Surat Pengumuman Kelulusan PSB 2027-2028 ${data.namaLengkap}.pdf`;
  return { buffer: Buffer.from(doc.output("arraybuffer")), filename };
}

export async function generateSuratPengumumanHasil(
  data: SuratPengumumanData
): Promise<{ buffer: Buffer; filename: string }> {
  return generateSuratDariTemplate(data);
}
