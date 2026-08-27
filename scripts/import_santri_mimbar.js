const { PrismaClient } = require('@prisma/client');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function importFromBendaharaFile() {
  const filePath = path.join(__dirname, '..', 'public', 'documents', 'Data Pendaftar - dari web.xlsx');
  
  if (!fs.existsSync(filePath)) {
    console.error('File tidak ditemukan di path:', filePath);
    process.exit(1);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  // Ambil sheet "Data_Pendaftar_20260702_171349" atau sheet ke-2
  let sheet = workbook.getWorksheet('Data_Pendaftar_20260702_171349');
  if (!sheet) {
    sheet = workbook.worksheets.find(s => s.rowCount > 0);
  }

  if (!sheet) {
    console.error('Sheet berisi data tidak ditemukan.');
    process.exit(1);
  }

  const tahunAjaran = await prisma.tahunAjaran.findFirst({
    where: { is_active: true }
  });

  if (!tahunAjaran) {
    console.error('Tidak ada Tahun Ajaran yang aktif.');
    process.exit(1);
  }

  let importedCount = 0;
  console.log('Mulai mengimport data santri Mimbar dari file Bendahara...');

  // Mulai dari baris 2 (karena baris 1 adalah header)
  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber++) {
    const row = sheet.getRow(rowNumber);
    
    const namaLengkap = row.getCell(2).value?.toString().trim(); // Nama Siswa di kolom 2 (B)
    const nik = row.getCell(4).value?.toString().trim(); // NIK di kolom 4 (D)
    
    if (!nik || !namaLengkap) continue;

    const nikStr = nik.toString();
    
    const existingPendaftar = await prisma.pendaftar.findFirst({
      where: { nik: nikStr, tahun_ajaran_id: tahunAjaran.id }
    });
    
    if (existingPendaftar) {
      console.log(`[SKIP] NIK ${nikStr} - ${namaLengkap} sudah terdaftar.`);
      continue;
    }

    try {
      const rawJenjang = row.getCell(5).value?.toString().trim() || 'SMP';
      const jenjang = rawJenjang.toLowerCase().includes('idad') ? 'IL' : 'SMP';
      const jkRaw = row.getCell(6).value?.toString().trim().toLowerCase() || 'laki-laki';
      const jenisKelamin = jkRaw.includes('perempuan') ? 'PEREMPUAN' : 'LAKI-LAKI';
      
      let rawHp = row.getCell(7).value?.toString().trim() || '-';
      if (rawHp.startsWith('62')) {
        rawHp = '0' + rawHp.substring(2);
      }
      const hpOrtu = rawHp;
      
      // Data dummy untuk yang kosong dari Mimbar
      const tempatLahir = '-';
      const tanggalLahir = new Date();
      const asalSekolah = 'Pesantren Mimbar Nagrak';
      const namaAyah = 'Bapak dari ' + namaLengkap;
      const namaIbu = 'Ibu dari ' + namaLengkap;
      const alamatLengkap = '-';

      const count = await prisma.pendaftar.count({
        where: { tahun_ajaran_id: tahunAjaran.id, jenjang: jenjang }
      });
      const noUrut = (count + 1).toString().padStart(4, '0');
      const nomorPendaftaran = `PSB${new Date().getFullYear()}${jenjang}${noUrut}`;

      const password = await bcrypt.hash("Andalus2026!", 10);
      let user = await prisma.profile.findFirst({ where: { phone: hpOrtu } });
      
      if (!user) {
        user = await prisma.profile.create({
          data: {
            full_name: namaAyah,
            phone: hpOrtu,
            password_hash: password,
            role: 'pendaftar'
          }
        });
      }

      await prisma.$transaction(async (tx) => {
        const pendaftar = await tx.pendaftar.create({
          data: {
            user_id: user.id,
            tahun_ajaran_id: tahunAjaran.id,
            nomor_pendaftaran: nomorPendaftaran,
            nik: nikStr,
            nama_lengkap: namaLengkap,
            jenis_kelamin: jenisKelamin,
            jenjang: jenjang,
            tempat_lahir: tempatLahir,
            tanggal_lahir: tanggalLahir,
            no_hp: hpOrtu,
            asal_sekolah: asalSekolah,
            alamat: alamatLengkap,
            tipe_pendaftaran: 'BARU',
            catatan_pindahan: 'Limpahan Mimbar dari file Bendahara',
            status_pendaftaran: 'submitted',
            verifikasi_status: 'verified'
          }
        });

        await tx.orangTua.create({
          data: {
            pendaftar_id: pendaftar.id,
            nama_ayah: namaAyah,
            nik_ayah: '-',
            no_hp_ayah: hpOrtu,
            nama_ibu: namaIbu,
            nik_ibu: '-',
            no_hp_ibu: hpOrtu,
            alamat_ayah: alamatLengkap,
            alamat_ibu: alamatLengkap
          }
        });
        
        await tx.hasilSeleksi.create({
          data: {
            pendaftar_id: pendaftar.id,
            tahun_ajaran_id: tahunAjaran.id,
            status_seleksi: 'DITERIMA',
            catatan_admin: 'Santri Limpahan Mimbar Nagrak',
            ditentukan_pada: new Date()
          }
        });
      });

      console.log(`[SUCCESS] Berhasil import: ${namaLengkap} (${nomorPendaftaran})`);
      importedCount++;
      
    } catch (err) {
      console.error(`[ERROR] Gagal import ${namaLengkap}:`, err.message);
    }
  }

  console.log(`\nSelesai! ${importedCount} santri Mimbar berhasil dimasukkan ke sistem Al Imam.`);
}

importFromBendaharaFile().catch(console.error).finally(async () => await prisma.$disconnect());
