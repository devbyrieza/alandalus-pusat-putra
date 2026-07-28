const ExcelJS = require('exceljs');
const path = require('path');

async function fix() {
  const filePath = path.join(__dirname, 'Pengajuan_Dana_MOSACUP_IT_Perfect.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(1);

  // Clear previous mistakes in row 12-18
  for(let r=12; r<=18; r++) {
    const row = sheet.getRow(r);
    for(let c=1; c<=10; c++) {
      row.getCell(c).value = null;
    }
  }

  // Row 12: Bola
  const row12 = sheet.getRow(12);
  row12.getCell(2).value = 2; // No.
  row12.getCell(3).value = 'Bola Sepak (Untuk Pertandingan MOSA CUP)'; // Uraian
  row12.getCell(6).value = 1; // Qty
  row12.getCell(7).value = 'pcs'; // Satuan
  row12.getCell(9).value = 100000; // Harga
  row12.getCell(10).value = { formula: 'F12*I12', result: 100000 };

  // Row 13: Voucher Tim
  const row13 = sheet.getRow(13);
  row13.getCell(2).value = 3;
  row13.getCell(3).value = 'Voucher Koperasi untuk Tim (Juara 1, 2, 3)';
  row13.getCell(6).value = 20;
  row13.getCell(7).value = 'tiket';
  row13.getCell(9).value = 5000;
  row13.getCell(10).value = { formula: 'F13*I13', result: 100000 };

  // Row 14: Voucher Individu
  const row14 = sheet.getRow(14);
  row14.getCell(2).value = 4;
  row14.getCell(3).value = 'Voucher Koperasi untuk Individu (Top Score, dll)';
  row14.getCell(6).value = 4;
  row14.getCell(7).value = 'tiket';
  row14.getCell(9).value = 5000;
  row14.getCell(10).value = { formula: 'F14*I14', result: 20000 };

  // Row 15: Piala
  const row15 = sheet.getRow(15);
  row15.getCell(2).value = 5;
  row15.getCell(3).value = 'Piala Utama (Juara 1)';
  row15.getCell(6).value = 1;
  row15.getCell(7).value = 'pcs';
  row15.getCell(9).value = 30000;
  row15.getCell(10).value = { formula: 'F15*I15', result: 30000 };

  // Row 16: Peluit
  const row16 = sheet.getRow(16);
  row16.getCell(2).value = 6;
  row16.getCell(3).value = 'Peluit Wasit Lapangan (Fox 40)';
  row16.getCell(6).value = 1;
  row16.getCell(7).value = 'pcs';
  row16.getCell(9).value = 35000;
  row16.getCell(10).value = { formula: 'F16*I16', result: 35000 };

  // Row 17: Snack Fairplay & Tim 5
  const row17 = sheet.getRow(17);
  row17.getCell(2).value = 7;
  row17.getCell(3).value = 'Snack Grosir & Permen (Tim Fairplay & Tim Terakhir)';
  row17.getCell(6).value = 1;
  row17.getCell(7).value = 'paket';
  row17.getCell(9).value = 20000;
  row17.getCell(10).value = { formula: 'F17*I17', result: 20000 };
  
  // Style for row 12-17 borders
  for (let r = 12; r <= 17; r++) {
    const rObj = sheet.getRow(r);
    for (let col = 2; col <= 15; col++) {
      const cell = rObj.getCell(col);
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      if (col === 2 || col === 6 || col === 7) cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (col === 9 || col === 10) {
          if (cell.value) cell.numFmt = '"Rp"#,##0';
      }
    }
  }

  // Update Total in Row 19 Col 10
  const totalRow = sheet.getRow(19);
  totalRow.getCell(10).value = { formula: 'SUM(J10:J18)', result: 455000 };

  await workbook.xlsx.writeFile(filePath);
  console.log('Fixed columns!');
}

fix().catch(console.error);
