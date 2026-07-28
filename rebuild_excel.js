const ExcelJS = require('exceljs');
const path = require('path');

async function rebuild() {
  const filePath = path.join(__dirname, 'Pengajuan_Dana_MOSACUP_IT_Perfect.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(1);

  // Clear rows 10 to 18 entirely to reset everything
  for (let r = 10; r <= 19; r++) {
    const row = sheet.getRow(r);
    for (let c = 1; c <= 15; c++) {
      const cell = row.getCell(c);
      cell.value = null;
      cell.border = null;
      cell.numFmt = null;
      // We don't remove alignment to keep the defaults, but let's reset it if needed
    }
  }

  // Row 10: Title (KEPERLUAN HADIAH)
  const row10 = sheet.getRow(10);
  row10.getCell(3).value = '--- KEPERLUAN HADIAH & ALAT MOSA CUP ---';
  row10.getCell(3).font = { bold: true, color: { argb: 'FF800000' } };
  row10.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE4D6' } };
  
  // Need to merge for title? Actually the original had it in Col 3, merged with 4,5.
  try { sheet.mergeCells('C10:E10'); } catch(e){}

  const data = [
    { no: 1, ur: 'Bola Sepak (Untuk Pertandingan MOSA CUP)', qty: 1, sat: 'pcs', harga: 100000 },
    { no: 2, ur: 'Voucher Koperasi untuk Tim (Juara 1, 2, 3)', qty: 20, sat: 'tiket', harga: 5000 },
    { no: 3, ur: 'Voucher Koperasi Individu (Top Score, dll)', qty: 4, sat: 'tiket', harga: 5000 },
    { no: 4, ur: 'Piala Utama (Juara 1)', qty: 1, sat: 'pcs', harga: 30000 },
    { no: 5, ur: 'Peluit Wasit Lapangan (Fox 40)', qty: 1, sat: 'pcs', harga: 35000 },
    { no: 6, ur: 'Snack Grosir Box (Khusus Tim Fairplay)', qty: 1, sat: 'box', harga: 15000 },
    { no: 7, ur: 'Permen / Snack Ringan (Tim Juru Kunci)', qty: 1, sat: 'bks', harga: 5000 },
  ];

  let r = 11;
  data.forEach(item => {
    const row = sheet.getRow(r);
    row.getCell(2).value = item.no;
    row.getCell(2).numFmt = '0';
    
    row.getCell(3).value = item.ur;
    try { sheet.mergeCells(`C${r}:E${r}`); } catch(e){}
    
    row.getCell(6).value = item.qty;
    row.getCell(6).numFmt = '0'; // Fix the Rp bug on Qty
    
    row.getCell(7).value = item.sat;
    
    row.getCell(9).value = item.harga;
    row.getCell(9).numFmt = '"Rp"#,##0';
    
    row.getCell(10).value = { formula: `F${r}*I${r}`, result: item.qty * item.harga };
    row.getCell(10).numFmt = '"Rp"#,##0';
    
    // Add borders
    [2, 3, 6, 7, 9, 10].forEach(c => {
      const cell = row.getCell(c);
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(6).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(7).alignment = { vertical: 'middle', horizontal: 'center' };
    
    r++;
  });

  // Total row at r = 18
  const totalRow = sheet.getRow(18);
  totalRow.getCell(9).value = 'TOTAL';
  totalRow.getCell(9).font = { bold: true };
  totalRow.getCell(10).value = { formula: 'SUM(J11:J17)', result: 305000 };
  totalRow.getCell(10).numFmt = '"Rp"#,##0';
  totalRow.getCell(10).font = { bold: true };
  totalRow.getCell(10).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

  // Fix explanations text to reflect this split
  const explanations = [
    'Rincian Distribusi Hadiah (Sistem Hierarki/Kasta untuk Menjaga Semangat Kompetitif):',
    '',
    '1. JUARA 1            : Piala Utama + Voucher Jajan Rp 50.000 (Bisa dipakai kapten beli snack elit)',
    '2. JUARA 2            : Voucher Jajan Rp 30.000 (Dibagikan ke tim)',
    '3. JUARA 3            : Voucher Jajan Rp 20.000 (Dibagikan ke tim)',
    '4. TIM FAIR PLAY      : 1 Box Snack Grosir (Rp 15.000) - Hadiah apresiasi akhlak untuk 1 tim',
    '5. TIM JURU KUNCI     : 1 Bungkus Permen (Rp 5.000) - Hadiah hiburan agar tidak pulang dengan tangan kosong',
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
    cell.font = { italic: i === 0 || i === 7 ? true : false, size: 11, bold: i === 8 };
    if (i > 1 && i < 7) {
        cell.font = { bold: true, color: { argb: 'FF000000' } };
    }
  });

  await workbook.xlsx.writeFile(filePath);
  console.log('Rebuilt successfully!');
}

rebuild().catch(console.error);
