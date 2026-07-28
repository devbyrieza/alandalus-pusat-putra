const ExcelJS = require('exceljs');
const path = require('path');

async function update() {
  const filePath = path.join(__dirname, 'Pengajuan_Dana_MOSACUP_IT_Perfect.xlsx');
  const workbook = new ExcelJS.Workbook();
  
  try {
    await workbook.xlsx.readFile(filePath);
  } catch (err) {
    console.log("Cannot read file, maybe locked? " + err.message);
    return;
  }
  
  const sheet = workbook.getWorksheet(1);
  
  // Row 12: Bola
  sheet.getRow(12).getCell(5).value = 100000;
  sheet.getRow(12).getCell(6).value = { formula: 'C12*E12', result: 100000 };

  // Row 13: Voucher Individu
  const row13 = sheet.getRow(13);
  row13.getCell(2).value = 'Voucher Paas Mart (Khusus Penghargaan Individu)';
  row13.getCell(3).value = 4;
  row13.getCell(4).value = 'tiket';
  row13.getCell(5).value = 5000;
  row13.getCell(6).value = { formula: 'C13*E13', result: 20000 };

  // Row 14: Snack Grosir (Untuk 5 Tim)
  const row14 = sheet.getRow(14);
  row14.getCell(2).value = 'Snack/Makanan Grosir (Hadiah Box/Pack untuk 5 Tim)';
  row14.getCell(3).value = 5;
  row14.getCell(4).value = 'box';
  row14.getCell(5).value = 20000;
  row14.getCell(6).value = { formula: 'C14*E14', result: 100000 };

  // Row 15: Piala
  const row15 = sheet.getRow(15);
  row15.getCell(2).value = 'Piala Utama (Juara 1)';
  row15.getCell(3).value = 1;
  row15.getCell(4).value = 'pcs';
  row15.getCell(5).value = 30000;
  row15.getCell(6).value = { formula: 'C15*E15', result: 30000 };

  // Row 16: Peluit
  const row16 = sheet.getRow(16);
  row16.getCell(2).value = 'Peluit Wasit Lapangan (Fox 40)';
  row16.getCell(3).value = 1;
  row16.getCell(4).value = 'pcs';
  row16.getCell(5).value = 35000;
  row16.getCell(6).value = { formula: 'C16*E16', result: 35000 };

  // Clear row 17
  const row17 = sheet.getRow(17);
  for(let i=1;i<=6;i++) row17.getCell(i).value = '';
  
  // Clear row 18
  const row18 = sheet.getRow(18);
  for(let i=1;i<=6;i++) row18.getCell(i).value = '';
  
  // Style for row 17 & 18 borders
  [17, 18].forEach(r => {
    const rObj = sheet.getRow(r);
    for (let col = 1; col <= 9; col++) {
      const cell = rObj.getCell(col);
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      if (col === 1 || col === 3 || col === 4) cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (col === 5 || col === 6) {
          if (cell.value) cell.numFmt = '"Rp"#,##0';
      }
    }
  });

  // Update Total (150k + 100k + 20k + 100k + 30k + 35k = 435000)
  const totalRow = sheet.getRow(19);
  totalRow.getCell(6).value = { formula: 'SUM(F10:F18)', result: 435000 };

  // Update Explanation text
  const explanations = [
    'Rincian Distribusi Hadiah (Semua Anggota Tim Dapat Bagian Rata):',
    '',
    '1. JUARA 1            : Piala Utama + 1 Box Snack Grosir (e.g. Nabati/Beng-Beng isi 20)',
    '2. JUARA 2            : 1 Box Snack Grosir Beda Varian',
    '3. JUARA 3            : 1 Box Snack Grosir Beda Varian',
    '4. TIM FAIR PLAY      : 1 Box Snack Grosir Beda Varian',
    '5. TIM PALING SEMANGAT: 1 Box Snack Grosir Beda Varian',
    '',
    'PENGHARGAAN INDIVIDU (Khusus Perorangan - 4 Tiket Voucher):',
    '- TOP SCORER          : Voucher Jajan Paas Mart Rp 10.000 (2 tiket)',
    '- BEST PLAYER         : Voucher Jajan Paas Mart Rp 5.000 (1 tiket)',
    '- BEST GOALKEEPER     : Voucher Jajan Paas Mart Rp 5.000 (1 tiket)'
  ];

  let startRow = 33;
  explanations.forEach((text, i) => {
    const cell = sheet.getCell(`B${startRow + i}`);
    cell.value = text;
    cell.font = { italic: i === 0 || i === 7 ? true : false, size: 11, bold: i === 8 };
    if (i > 1 && i < 7) {
        cell.font = { bold: true, color: { argb: 'FF000000' } };
    }
  });

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log('Done modifying Perfect.xlsx with smart distribution');
  } catch (err) {
    console.log("Could not write file. Close Excel first. " + err.message);
  }
}

update().catch(console.error);
