const ExcelJS = require('exceljs');
const path = require('path');

async function fix() {
  const filePath = path.join(__dirname, 'Pengajuan_Dana_MOSACUP_IT_Perfect.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(1);

  // Update explanation on row 14 to avoid confusion
  const row14 = sheet.getRow(14);
  row14.getCell(3).value = 'Voucher Koperasi Individu (Top Scorer dapat 2 tiket)';
  
  await workbook.xlsx.writeFile(filePath);
  console.log('Fixed row 14 description!');
}

fix().catch(console.error);
