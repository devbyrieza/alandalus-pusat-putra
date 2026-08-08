import fs from "fs";
import { generateSuratKesehatan, generateSuratPernyataan, generatePaktaIntegritas, PendaftarPdfData } from "./src/lib/utils/pdf-generator";

const dummyData: PendaftarPdfData = {
  nomor_pendaftaran: "TEST-2026-001",
  nama_lengkap: "",
  nik: "3202111111111111",
  jenjang: "SMA",
  tempat_lahir: "Sukabumi",
  tanggal_lahir: "01 Januari 2010",
  alamat: "",
  no_hp: "081234567890",
  tahun_ajaran: "2027-2028",
};

async function generate() {
  console.log("Generating Surat Kesehatan...");
  const doc1 = await generateSuratKesehatan(dummyData);
  fs.writeFileSync("Contoh_SuratKesehatan.pdf", Buffer.from(doc1.output("arraybuffer")));

  console.log("Generating Surat Pernyataan...");
  const doc2 = await generateSuratPernyataan(dummyData);
  fs.writeFileSync("Contoh_SuratPernyataan.pdf", Buffer.from(doc2.output("arraybuffer")));

  console.log("Generating Pakta Integritas...");
  const doc3 = await generatePaktaIntegritas(dummyData);
  fs.writeFileSync("Contoh_PaktaIntegritas.pdf", Buffer.from(doc3.output("arraybuffer")));

  console.log("Selesai! File berhasil di-generate di folder root alandalus-alimam.");
}

generate().catch(console.error);
