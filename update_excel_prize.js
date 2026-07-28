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

  // Signatures usually take up to row 30. We will put the explanation at row 32.
  sheet.mergeCells('B32:H32');
  const title = sheet.getCell('B32');
  title.value = 'RINCIAN ALOKASI DISTRIBUSI HADIAH MOSA CUP 2026/2027:';
  title.font = { bold: true, underline: true, color: { argb: 'FF800000' } };
  
  // Explanation text
  const explanations = [
    'Untuk menghindari kecemburuan karena ada 5 tim, maka DIBUAT 5 PENGHARGAAN TIM agar semua tim pulang membawa hadiah:',
    '',
    '1. JUARA 1            : Piala Utama + Voucher Jajan Rp 50.000 (10 tiket)',
    '2. JUARA 2            : 1 Pack Buku Tulis + Voucher Jajan Rp 30.000 (6 tiket)',
    '3. JUARA 3            : 1 Pack Buku Tulis + Voucher Jajan Rp 20.000 (4 tiket)',
    '4. TIM FAIR PLAY      : Voucher Jajan Rp 15.000 (3 tiket)',
    '5. TIM PALING SEMANGAT: 1 Pack Buku Tulis + Voucher Jajan Rp 15.000 (3 tiket) -> (Agar tim peringkat 5 tidak sedih)',
    '',
    'PENGHARGAAN INDIVIDU (Sisa 4 tiket voucher):',
    '- TOP SCORER          : Voucher Jajan Rp 10.000 (2 tiket)',
    '- BEST PLAYER         : Voucher Jajan Rp 5.000 (1 tiket)',
    '- BEST GOALKEEPER     : Voucher Jajan Rp 5.000 (1 tiket)'
  ];

  let startRow = 33;
  explanations.forEach((text, i) => {
    sheet.mergeCells(`B${startRow + i}:H${startRow + i}`);
    const cell = sheet.getCell(`B${startRow + i}`);
    cell.value = text;
    cell.font = { italic: i === 0 || i === 7 ? true : false, size: 11, bold: i === 8 };
    if (i > 1 && i < 7) {
        cell.font = { bold: true, color: { argb: 'FF000000' } };
    }
  });

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log('Done adding explanation to Perfect.xlsx');
  } catch (err) {
    console.log("Could not write file. Close Excel first. " + err.message);
  }
}

update().catch(console.error);
