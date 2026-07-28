const { PrismaClient } = require('@prisma/client');
const ExcelJS = require('exceljs');
const path = require('path');

// Menggunakan URL yang diberikan
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://coolify:FfJ8to6XLZ1LooULnKW7ULXDbIfQn3KxMUPAUXz15Q0=@coolify-db:5432/ppdb_alimam"
    },
  },
});

async function main() {
  console.log("Mengambil data dari database...");

  // Mengambil semua data pendaftar beserta relasinya
  const pendaftars = await prisma.pendaftar.findMany({
    include: {
      orang_tua: true,
      hasil_seleksi: true,
      asrama: true,
      pembayaran: true,
      dokumen: true
    },
    orderBy: {
      nama_lengkap: 'asc'
    }
  });

  console.log(`Ditemukan ${pendaftars.length} data santri.`);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Data PPDB Final');

  // Title Rows
  sheet.mergeCells('A1:O1');
  const titleRow1 = sheet.getCell('A1');
  titleRow1.value = 'DATA MONITORING PPDB - PONDOK PESANTREN AL ANDALUS AL IMAM';
  titleRow1.font = { name: 'Arial', size: 14, bold: true };
  titleRow1.alignment = { vertical: 'middle', horizontal: 'center' };

  sheet.addRow([]); // Baris kosong

  // Headers
  const headerRow = sheet.getRow(3);
  headerRow.values = [
    'No', 
    'NIS', 
    'NIK', 
    'Nama Lengkap', 
    'Jenjang', 
    'Jenis Kelamin', 
    'Asal Sekolah', 
    'Status Seleksi', 
    'Nama Ayah', 
    'Nama Ibu', 
    'No HP', 
    'Asrama',
    'Status Pembayaran',
    'Berkas Lengkap'
  ];
  
  // Style Headers
  for (let i = 1; i <= 14; i++) {
    const cell = headerRow.getCell(i);
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF064E3B' } }; // Hijau gelap
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  }

  // Set Column Widths
  sheet.getColumn(1).width = 5;
  sheet.getColumn(2).width = 15;
  sheet.getColumn(3).width = 20;
  sheet.getColumn(4).width = 35;
  sheet.getColumn(5).width = 10;
  sheet.getColumn(6).width = 15;
  sheet.getColumn(7).width = 30;
  sheet.getColumn(8).width = 15;
  sheet.getColumn(9).width = 25;
  sheet.getColumn(10).width = 25;
  sheet.getColumn(11).width = 20;
  sheet.getColumn(12).width = 15;
  sheet.getColumn(13).width = 20;
  sheet.getColumn(14).width = 15;

  // Add Data
  pendaftars.forEach((p, index) => {
    const row = sheet.getRow(4 + index);
    
    // Mengecek kelengkapan dokumen
    const isDokumenLengkap = p.dokumen && p.dokumen.every(d => d.is_verified) ? 'Lengkap' : 'Belum Lengkap';
    
    // Status Pembayaran (cek lunas pendaftaran/daftar ulang)
    let statusBayar = 'Belum Lunas';
    if (p.pembayaran && p.pembayaran.some(bayar => bayar.status_pembayaran === 'verified')) {
      statusBayar = 'Lunas/Verified';
    }

    row.values = [
      index + 1,
      p.nis || '-',
      p.nik || '-',
      p.nama_lengkap,
      p.jenjang,
      p.jenis_kelamin === 'L' ? 'Laki-laki' : (p.jenis_kelamin === 'P' ? 'Perempuan' : p.jenis_kelamin),
      p.asal_sekolah || '-',
      p.hasil_seleksi ? p.hasil_seleksi.status_seleksi : 'Belum Ditentukan',
      p.orang_tua ? p.orang_tua.nama_ayah : '-',
      p.orang_tua ? p.orang_tua.nama_ibu : '-',
      p.orang_tua ? p.orang_tua.no_hp_ayah || p.orang_tua.no_hp_ibu : p.no_hp,
      p.asrama && p.asrama.pilihan_asrama ? 'Ya' : 'Tidak',
      statusBayar,
      isDokumenLengkap
    ];

    // Borders and Alignment
    for (let colNumber = 1; colNumber <= 14; colNumber++) {
      const cell = row.getCell(colNumber);
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
      if ([1, 2, 3, 5, 6, 8, 12, 13, 14].includes(colNumber)) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }
    }
  });

  const fileName = 'Data_Monitoring_PPDB_AlImam_Final.xlsx';
  const filePath = path.join(__dirname, fileName);
  await workbook.xlsx.writeFile(filePath);
  
  console.log(`\nBerhasil! File Excel telah dibuat di: ${filePath}`);
  console.log("Silakan kirim file ini ke Bu Retna.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
