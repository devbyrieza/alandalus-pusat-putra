import { generateSuratKesehatan } from "../src/lib/utils/pdf-generator";

const dummyData = {
  nomor_pendaftaran: "TEST-2026-001",
  nama_lengkap: "Ahmad Fulan bin Fulan",
  nik: "3202111111111111",
  jenjang: "SMA",
  tempat_lahir: "Sukabumi",
  tanggal_lahir: "01 Januari 2010",
  alamat: "Jl. Merdeka No. 10, Sukabumi",
  no_hp: "081234567890",
  tahun_ajaran: "2027/2028",
};

async function test() {
  const doc = await generateSuratKesehatan(dummyData);
  console.log("--- DIAGNOSTICS ---");
  console.log("Total Pages:", doc.internal.getNumberOfPages());
  console.log("lastAutoTable finalY:", doc.lastAutoTable.finalY);
}

test().catch(console.error);
