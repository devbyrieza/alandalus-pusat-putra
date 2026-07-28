import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import * as archiver from 'archiver';

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses penarikan data untuk CRM...');

  // 1. Baca data NIS dari Excel yang sudah fix
  const nisWorkbook = xlsx.readFile('Data_NIS_Santri_Baru_2026_Terpisah.xlsx');
  const nisData: { nama: string, jenjang: string, nis: string }[] = [];
  
  for (const sheetName of nisWorkbook.SheetNames) {
    const sheet = nisWorkbook.Sheets[sheetName];
    const rows: any[] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    // Mulai dari baris ke-4 (indeks 3) karena baris awal adalah header/judul
    for (let i = 3; i < rows.length; i++) {
      if (rows[i] && rows[i].length >= 4) {
        nisData.push({
          nama: rows[i][1]?.toString().trim(),
          jenjang: rows[i][2]?.toString().trim(),
          nis: rows[i][3]?.toString().trim()
        });
      }
    }
  }
  console.log(`Berhasil membaca ${nisData.length} data NIS dari Excel.`);

  // 2. Ambil data lengkap dari database
  const pendaftarDiterima = await prisma.pendaftar.findMany({
    where: { status_pendaftaran: 'accepted' },
    include: {
      dokumen: true
    }
  });
  console.log(`Ditemukan ${pendaftarDiterima.length} santri berstatus Diterima di Database.`);

  // 3. Update NIS ke database dan siapkan data untuk Template CRM
  const crmRows = [];
  
  for (let i = 0; i < pendaftarDiterima.length; i++) {
    const pendaftar = pendaftarDiterima[i];
    
    // Cari NIS berdasarkan nama
    const match = nisData.find(n => n.nama.toLowerCase() === pendaftar.nama_lengkap.toLowerCase() && n.jenjang === pendaftar.jenjang);
    const nis = match ? match.nis : pendaftar.nomor_pendaftaran; // Fallback ke no daftar jika tidak ada

    // Update NIS ke database
    await prisma.pendaftar.update({
      where: { id: pendaftar.id },
      data: { nis: nis }
    });

    // Siapkan baris untuk Excel CRM
    crmRows.push({
      "No": i + 1,
      "Nomor Identitas 1": nis,
      "Nomor Identitas 2": pendaftar.nik,
      "Nama": pendaftar.nama_lengkap,
      "Tempat Lahir": pendaftar.tempat_lahir || "-",
      "Tanggal Lahir": pendaftar.tanggal_lahir ? pendaftar.tanggal_lahir.toLocaleDateString('id-ID') : "-",
      "Jenis Kelamin": pendaftar.jenis_kelamin === 'Laki-laki' || pendaftar.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
      "Alamat": pendaftar.alamat || "-",
      "Kelas": pendaftar.jenjang === 'MTs' ? '7' : '10',
      "Kelas Detail": `${pendaftar.jenjang} Baru`,
      "Tags": "Santri Baru 2026",
      "Note": pendaftar.nomor_pendaftaran
    });
  }
  console.log('Berhasil mengupdate NIS di Database.');

  // 4. Buat File Excel Template CRM
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(crmRows);
  xlsx.utils.book_append_sheet(wb, ws, "Data Santri CRM");
  
  const crmFilename = 'Data_CRM_AlImam_2026.xlsx';
  xlsx.writeFile(wb, crmFilename);
  console.log(`Berhasil membuat file excel: ${crmFilename}`);

  // 5. Ekstrak dan Rename Foto ke dalam ZIP
  console.log('Mengekstrak dan mengganti nama file foto...');
  const outputZip = fs.createWriteStream('Foto_Santri_CRM.zip');
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  outputZip.on('close', function() {
    console.log(`Berhasil membuat ZIP Foto. Total ukuran: ${archive.pointer()} bytes`);
    console.log('\n=============================================');
    console.log('SEMUA TUGAS SELESAI!');
    console.log('1. NIS sudah tersimpan di database.');
    console.log('2. File Data_CRM_AlImam_2026.xlsx sudah terbuat.');
    console.log('3. File Foto_Santri_CRM.zip sudah siap dikirim.');
    console.log('=============================================');
  });

  archive.pipe(outputZip);

  for (const pendaftar of pendaftarDiterima) {
    const fotoDoc = pendaftar.dokumen.find(d => d.jenis_dokumen === 'pas_foto');
    if (fotoDoc && fotoDoc.file_path) {
      const match = nisData.find(n => n.nama.toLowerCase() === pendaftar.nama_lengkap.toLowerCase() && n.jenjang === pendaftar.jenjang);
      const nis = match ? match.nis : pendaftar.nomor_pendaftaran;
      
      const absolutePath = path.join(process.cwd(), 'storage_data', 'dokumen-pendaftaran', path.basename(fotoDoc.file_path));
      if (fs.existsSync(absolutePath)) {
        // Tentukan ekstensi
        const ext = path.extname(absolutePath) || '.jpg';
        // Nama file di dalam zip menjadi: NIS.jpg
        archive.file(absolutePath, { name: `${nis}${ext}` });
      }
    }
  }

  await archive.finalize();
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
