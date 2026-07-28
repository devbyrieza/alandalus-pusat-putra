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

  // Row 13: Voucher Tim (Juara 1, 2, 3)
  const row13 = sheet.getRow(13);
  row13.getCell(2).value = 'Voucher Koperasi untuk Tim (Juara 1, 2, 3)';
  row13.getCell(3).value = 20;
  row13.getCell(4).value = 'tiket';
  row13.getCell(5).value = 5000; // Total 100.000 (10 tiket juara 1, 6 tiket juara 2, 4 tiket juara 3)
  row13.getCell(6).value = { formula: 'C13*E13', result: 100000 };

  // Row 14: Voucher Individu
  const row14 = sheet.getRow(14);
  row14.getCell(2).value = 'Voucher Koperasi untuk Individu (Top Score, dll)';
  row14.getCell(3).value = 4;
  row14.getCell(4).value = 'tiket';
  row14.getCell(5).value = 5000; // Total 20.000
  row14.getCell(6).value = { formula: 'C14*E14', result: 20000 };

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

  // Row 17: Snack Fairplay & Tim 5
  const row17 = sheet.getRow(17);
  row17.getCell(1).value = 7;
  row17.getCell(2).value = 'Snack Grosir & Permen (Untuk Tim Fairplay & Tim Terakhir)';
  row17.getCell(3).value = 1;
  row17.getCell(4).value = 'paket';
  row17.getCell(5).value = 20000;
  row17.getCell(6).value = { formula: 'C17*E17', result: 20000 };
  
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

  // Update Total: 150k + 100k + 100k + 20k + 30k + 35k + 20k = 455000
  const totalRow = sheet.getRow(19);
  totalRow.getCell(6).value = { formula: 'SUM(F10:F18)', result: 455000 };

  // Update Explanation text
  const explanations = [
    'Rincian Distribusi Hadiah (Sistem Hierarki/Kasta untuk Menjaga Semangat Kompetitif):',
    '',
    '1. JUARA 1            : Piala Utama + Voucher Jajan Rp 50.000 (Bisa dipakai kapten beli snack elit)',
    '2. JUARA 2            : Voucher Jajan Rp 30.000 (Dibagikan ke tim)',
    '3. JUARA 3            : Voucher Jajan Rp 20.000 (Dibagikan ke tim)',
    '4. TIM FAIR PLAY      : 1 Box Snack Grosir Murah (Rp 15.000) sebagai apresiasi akhlak',
    '5. TIM TERAKHIR       : 1 Bungkus Permen (Rp 5.000) agar tidak pulang dengan tangan kosong / sedih',
    '',
    'PENGHARGAAN INDIVIDU (Sisa 4 Tiket Voucher):',
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
    console.log('Done modifying Perfect.xlsx with Hierarchy');
  } catch (err) {
    console.log("Could not write file. Close Excel first. " + err.message);
  }
}

update().catch(console.error);
