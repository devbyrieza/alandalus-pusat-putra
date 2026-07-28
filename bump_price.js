const ExcelJS = require('exceljs');
const path = require('path');

async function update() {
  const filePath = path.join(__dirname, 'Pengajuan_Dana_MOSACUP_IT_Perfect.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(1);

  // Bump Tim Juru Kunci to 10.000
  const row17 = sheet.getRow(17);
  row17.getCell(3).value = 'Snack Ringan Seribuan (Tim Juru Kunci)';
  row17.getCell(9).value = 10000;
  row17.getCell(10).value = { formula: 'F17*I17', result: 10000 };

  // Update total
  const totalRow = sheet.getRow(18);
  totalRow.getCell(10).value = { formula: 'SUM(J11:J17)', result: 310000 };

  // Update explanation
  const explanations = [
    'Rincian Distribusi Hadiah (Sistem Hierarki/Kasta untuk Menjaga Semangat Kompetitif):',
    '',
    '1. JUARA 1            : Piala Utama + Voucher Jajan Rp 50.000 (Bisa dipakai kapten beli snack elit)',
    '2. JUARA 2            : Voucher Jajan Rp 30.000 (Dibagikan ke tim)',
    '3. JUARA 3            : Voucher Jajan Rp 20.000 (Dibagikan ke tim)',
    '4. TIM FAIR PLAY      : 1 Box Snack Grosir (Rp 15.000) - Hadiah apresiasi akhlak untuk 1 tim',
    '5. TIM JURU KUNCI     : 10 pcs Snack Seribuan (Rp 10.000) - Hadiah hiburan agar tidak pulang tangan kosong',
    '',
    'PENGHARGAAN INDIVIDU (Sisa 4 Tiket Voucher):',
    '- TOP SCORER          : Voucher Jajan Paas Mart Rp 10.000 (2 tiket)',
    '- BEST PLAYER         : Voucher Jajan Paas Mart Rp 5.000 (1 tiket)',
    '- BEST GOALKEEPER     : Voucher Jajan Paas Mart Rp 5.000 (1 tiket)'
  ];

  let startRow = 32;
  explanations.forEach((text, i) => {
    const cell = sheet.getCell(`B${startRow + i}`);
    cell.value = text;
  });

  await workbook.xlsx.writeFile(filePath);
  console.log('Bumped juru kunci to 10k!');
}

update().catch(console.error);
