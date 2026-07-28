const ExcelJS = require('exceljs');
const path = require('path');

async function update() {
  const filePath = path.join(__dirname, 'Pengajuan_Dana_MOSACUP_IT_Perfect.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(1);

  // Update explanation text to make it extremely clear how to divide it
  const explanations = [
    'Rincian Distribusi Hadiah (Sistem Hierarki/Kasta untuk Menjaga Semangat Kompetitif):',
    '',
    '1. JUARA 1            : Piala Utama + Voucher Jajan Rp 50.000 (Kapten membelanjakan snack/minuman senilai 50rb lalu dibagi ke 10 anggota)',
    '2. JUARA 2            : Voucher Jajan Rp 30.000 (Kapten membelanjakan snack/minuman senilai 30rb lalu dibagi ke 10 anggota)',
    '3. JUARA 3            : Voucher Jajan Rp 20.000 (Kapten membelanjakan snack/minuman senilai 20rb lalu dibagi ke 10 anggota)',
    '4. TIM FAIR PLAY      : 1 Box Snack Grosir (Rp 15.000) - Hadiah apresiasi akhlak untuk 1 tim (Isi box dibagi rata)',
    '5. TIM JURU KUNCI     : 10 pcs Snack Seribuan (Rp 10.000) - Hadiah hiburan (Masing-masing santri dapat 1 bungkus snack kecil)',
    '',
    'PENGHARGAAN INDIVIDU (Sisa 4 Tiket Voucher):',
    '- TOP SCORER          : Voucher Jajan Paas Mart Rp 10.000 (2 tiket untuk 1 orang pencetak gol terbanyak)',
    '- BEST PLAYER         : Voucher Jajan Paas Mart Rp 5.000 (1 tiket)',
    '- BEST GOALKEEPER     : Voucher Jajan Paas Mart Rp 5.000 (1 tiket)'
  ];

  let startRow = 32;
  explanations.forEach((text, i) => {
    const cell = sheet.getCell(`B${startRow + i}`);
    cell.value = text;
    cell.font = { italic: i === 0 || i === 7 ? true : false, size: 11, bold: i === 8 };
    if (i > 1 && i < 7) {
        cell.font = { bold: true, color: { argb: 'FF000000' } };
    }
  });

  await workbook.xlsx.writeFile(filePath);
  console.log('Fixed explanations detail!');
}

update().catch(console.error);
