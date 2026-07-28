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

  // Update item No 5 (Row 15 based on screenshot)
  const no5 = sheet.getRow(15);
  no5.getCell(2).value = 'Piala Utama (Untuk Juara 1)';
  no5.getCell(3).value = 1;
  no5.getCell(4).value = 'pcs';
  no5.getCell(5).value = 30000;
  no5.getCell(6).value = { formula: 'C15*E15', result: 30000 };

  // Add Peluit Wasit (Row 16)
  const no6 = sheet.getRow(16);
  no6.getCell(1).value = 6;
  no6.getCell(2).value = 'Peluit Wasit Lapangan (Fox 40)';
  no6.getCell(3).value = 1;
  no6.getCell(4).value = 'pcs';
  no6.getCell(5).value = 35000;
  no6.getCell(6).value = { formula: 'C16*E16', result: 35000 };
  
  // Style for row 16
  for (let col = 1; col <= 9; col++) {
    const cell = no6.getCell(col);
    cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    };
    if (col === 1 || col === 3 || col === 4) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    }
    if (col === 5 || col === 6) {
        cell.numFmt = '"Rp"#,##0';
    }
  }

  // Update Book info
  const no4 = sheet.getRow(14);
  no4.getCell(2).value = 'Buku Tulis Grosir (Hadiah Juara 2 & 3)';

  // Update Total Pengajuan (Assume it is row 19 based on screenshot)
  const totalRow = sheet.getRow(19);
  totalRow.getCell(6).value = { formula: 'SUM(F10:F18)', result: 470000 };

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log('Done modifying Perfect.xlsx');
  } catch (err) {
    console.log("Could not write file. Close Excel first. " + err.message);
  }
}

update().catch(console.error);
