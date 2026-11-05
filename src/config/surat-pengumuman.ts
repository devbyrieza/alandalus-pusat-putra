/**
 * Konfigurasi Surat Pengumuman Kelulusan PSB — Al-Andalus Putra
 * Format mengacu surat resmi: <SEQ>/PSB/G<GELOMBANG>/<ROMAWI>/<TA>
 * Contoh: 001/PSB/G1/X/2728 (SEQ urut 3 digit, TA compact 2728 = 2027/2028)
 * Ubah teks di sini (bukan di generator) bila kebijakan panitia berubah.
 */
export const SURAT_PENGUMUMAN_CONFIG = {
  nomorPrefix: "", // tanpa prefix — SEQ langsung di depan
  nomorSuffix: "PSB", // <SEQ>/PSB/G1/<ROMAWI>/<TA>
  gelombangDefault: 1,
  taCompact: "2728",
  kota: "Bogor",
  jenjangDefault: "SMP IT",
  kelasDiterimaDefault: "VII",
  ketuaPanitia: "Lalu Tegar Dwiki Putra, S.H.",
  kodeAkademik: "2247",
  namaBank: "Pesantren Al-Andalus Putra",
  // Aset tanda tangan (null = sudah ada di background template, tidak digambar ulang)
  signatureImage: null as string | null,
  stampImage: null as string | null,
};
