const ExcelJS = require('exceljs');
const path = require('path');

async function clean() {
  const filePath = path.join(__dirname, 'Pengajuan_Dana_MOSACUP_IT_Perfect.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(1);

  // Clear rows 30 to 50 to remove all the messed up text
  for (let r = 30; r <= 50; r++) {
    const row = sheet.getRow(r);
    for (let c = 1; c <= 15; c++) {
      const cell = row.getCell(c);
      cell.value = null;
      cell.border = null;
      cell.font = null;
    }
  }

  // It's possible there are lingering merges. ExcelJS handles unmerging via unMergeCells, but you need the exact range.
  // Instead of unmerging, we can just write to B and merge B:H properly.

  const explanations = [
    'Rincian Distribusi Hadiah (Sistem Hierarki/Kasta untuk Menjaga Semangat Kompetitif):',
    '',
    '1. JUARA 1            : Piala Utama + Voucher Jajan Rp 50.000 (Kapten belanja senilai 50rb lalu dibagi ke 10 anggota)',
    '2. JUARA 2            : Voucher Jajan Rp 30.000 (Kapten belanja senilai 30rb lalu dibagi ke 10 anggota)',
    '3. JUARA 3            : Voucher Jajan Rp 20.000 (Kapten belanja senilai 20rb lalu dibagi ke 10 anggota)',
    '4. TIM FAIR PLAY      : 1 Box Snack Grosir (Rp 15.000) - Hadiah apresiasi akhlak untuk 1 tim (Isi box dibagi rata)',
    '5. TIM JURU KUNCI     : 10 pcs Snack Seribuan (Rp 10.000) - Hadiah hiburan (Masing-masing santri dapat 1 snack)',
    '',
    'PENGHARGAAN INDIVIDU (Sisa 4 Tiket Voucher):',
    '- TOP SCORER          : Voucher Jajan Paas Mart Rp 10.000 (2 tiket untuk 1 orang pencetak gol terbanyak)',
    '- BEST PLAYER         : Voucher Jajan Paas Mart Rp 5.000 (1 tiket)',
    '- BEST GOALKEEPER     : Voucher Jajan Paas Mart Rp 5.000 (1 tiket)'
  ];

  let startRow = 32;
  explanations.forEach((text, i) => {
    // Attempt to unmerge first just in case
    try { sheet.unMergeCells(`B${startRow + i}:H${startRow + i}`); } catch(e) {}
    try { sheet.unMergeCells(`B${startRow + i}:M${startRow + i}`); } catch(e) {}
    
    // Clear the cells in the row again to be absolutely sure
    for(let c=2; c<=12; c++) {
      sheet.getRow(startRow + i).getCell(c).value = null;
    }

    const cell = sheet.getCell(`B${startRow + i}`);
    cell.value = text;
    cell.font = { italic: i === 0 || i === 7 ? true : false, size: 11, bold: i === 8 };
    if (i > 1 && i < 7) {
        cell.font = { bold: true, color: { argb: 'FF000000' } };
    }
    
    // Merge properly
    try {
      sheet.mergeCells(`B${startRow + i}:K${startRow + i}`);
    } catch(e) {
      console.log('Merge failed on row ' + (startRow+i) + ': ' + e.message);
    }
  });

  await workbook.xlsx.writeFile(filePath);
  console.log('Cleaned bottom text!');
}

clean().catch(console.error);
