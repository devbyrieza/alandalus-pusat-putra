const ExcelJS = require('exceljs');
const path = require('path');

async function createTemplate() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Data Santri Baru');

  // Define columns
  sheet.columns = [
    { header: 'No', key: 'no', width: 5 },
    { header: 'NIK (Wajib)', key: 'nik', width: 20 },
    { header: 'Nama Lengkap Santri (Wajib)', key: 'nama', width: 30 },
    { header: 'Jenis Kelamin (L/P) (Wajib)', key: 'jk', width: 15 },
    { header: 'Tempat Lahir (Wajib)', key: 'tempat_lahir', width: 20 },
    { header: 'Tanggal Lahir (YYYY-MM-DD) (Wajib)', key: 'tanggal_lahir', width: 20 },
    { header: 'Jenjang Masuk (SMP/IL) (Wajib)', key: 'jenjang', width: 15 },
    { header: 'No HP/WA Pendaftar (Wajib)', key: 'hp', width: 20 },
    { header: 'Asal Sekolah', key: 'asal_sekolah', width: 25 },
    { header: 'Nama Lengkap Ayah (Wajib)', key: 'nama_ayah', width: 25 },
    { header: 'NIK Ayah (Wajib)', key: 'nik_ayah', width: 20 },
    { header: 'Nama Lengkap Ibu (Wajib)', key: 'nama_ibu', width: 25 },
    { header: 'NIK Ibu (Wajib)', key: 'nik_ibu', width: 20 },
    { header: 'No HP/WA Ortu (Ayah/Ibu) (Wajib)', key: 'hp_ortu', width: 25 },
    { header: 'Alamat Lengkap (Jalan, RT/RW, Desa, Kec, Kab, Prov) (Wajib)', key: 'alamat', width: 50 },
  ];

  // Style headers
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF550000' } // Merah Maroon Al Imam
  };
  
  // Add some dummy rows as examples
  sheet.addRow({
    no: 1,
    nik: '3201012345678901',
    nama: 'Ahmad Fulan',
    jk: 'L',
    tempat_lahir: 'Sukabumi',
    tanggal_lahir: '2010-05-15',
    jenjang: 'SMP',
    hp: '081234567890',
    asal_sekolah: 'SDIT Al Fatih',
    nama_ayah: 'Fulan bin Fulan',
    nik_ayah: '3201019876543210',
    nama_ibu: 'Fulanah binti Fulan',
    nik_ibu: '3201011122334455',
    hp_ortu: '081298765432',
    alamat: 'Jl. Raya Nagrak No 10, RT 01/RW 02, Ds. Nagrak, Kec. Nagrak, Kab. Sukabumi, Jawa Barat'
  });
  
  // Style the dummy row with light grey to indicate it's an example
  sheet.getRow(2).font = { italic: true, color: { argb: 'FF666666' } };

  // Add empty rows for them to fill
  for (let i = 2; i <= 15; i++) {
    sheet.addRow({ no: i });
  }

  const outputPath = path.join(__dirname, '..', 'Template_Data_Santri_Mimbar.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  
  console.log(`Berhasil membuat template di: ${outputPath}`);
}

createTemplate().catch(console.error);
