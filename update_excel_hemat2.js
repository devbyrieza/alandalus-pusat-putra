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

  // Row 10 is VM (150k)
  
  // Row 12: Bola
  sheet.getRow(12).getCell(5).value = 100000;
  sheet.getRow(12).getCell(6).value = { formula: 'C12*E12', result: 100000 };

  // Row 13: Voucher
  const row13 = sheet.getRow(13);
  row13.getCell(2).value = 'Voucher Paas Mart (Hadiah Utama & Hiburan)';
  row13.getCell(3).value = 10;
  row13.getCell(4).value = 'tiket';
  row13.getCell(5).value = 5000;
  row13.getCell(6).value = { formula: 'C13*E13', result: 50000 };

  // Row 14: Buku Tulis
  const row14 = sheet.getRow(14);
  row14.getCell(2).value = 'Buku Tulis (Hadiah Juara 2 & 3)';
  row14.getCell(3).value = 1;
  row14.getCell(4).value = 'pack';
  row14.getCell(5).value = 35000;
  row14.getCell(6).value = { formula: 'C14*E14', result: 35000 };

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

  // Row 17: Permen
  const row17 = sheet.getRow(17);
  row17.getCell(1).value = 7;
  row17.getCell(2).value = 'Permen / Snack Grosir (Hiburan Tim 5)';
  row17.getCell(3).value = 1;
  row17.getCell(4).value = 'bks';
  row17.getCell(5).value = 15000;
  row17.getCell(6).value = { formula: 'C17*E17', result: 15000 };

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

  // Update Total
  const totalRow = sheet.getRow(19);
  totalRow.getCell(6).value = { formula: 'SUM(F10:F18)', result: 415000 };

  // Update Explanation text
  const explanations = [
    'Rincian Distribusi Hadiah (Versi Sangat Hemat - Khusus Angkatan Perintis):',
    '',
    '1. JUARA 1            : Piala Utama + Voucher Rp 15.000 (3 tiket)',
    '2. JUARA 2            : 6 Buah Buku Tulis',
    '3. JUARA 3            : 4 Buah Buku Tulis',
    '4. TIM FAIR PLAY      : Voucher Rp 15.000 (3 tiket)',
    '5. TIM PALING SEMANGAT: 1 Bungkus Permen/Snack Grosir (Dibagi rata 1 tim agar tidak ada yang sedih)',
    '',
    'PENGHARGAAN INDIVIDU (Sisa 4 tiket voucher):',
    '- TOP SCORER          : Voucher Rp 10.000 (2 tiket)',
    '- BEST PLAYER         : Voucher Rp 5.000 (1 tiket)',
    '- BEST GOALKEEPER     : Voucher Rp 5.000 (1 tiket)'
  ];

  let startRow = 33;
  explanations.forEach((text, i) => {
    // We already merged these cells in the previous run, so we just set value directly
    const cell = sheet.getCell(`B${startRow + i}`);
    cell.value = text;
    cell.font = { italic: i === 0 || i === 7 ? true : false, size: 11, bold: i === 8 };
    if (i > 1 && i < 7) {
        cell.font = { bold: true, color: { argb: 'FF000000' } };
    }
  });

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log('Done modifying Perfect.xlsx with low budget');
  } catch (err) {
    console.log("Could not write file. Close Excel first. " + err.message);
  }
}

update().catch(console.error);
