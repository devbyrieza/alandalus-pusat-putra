const ExcelJS = require('exceljs');
const path = require('path');

async function read() {
  const filePath = path.join(__dirname, 'Pengajuan_Dana_MOSACUP_IT_Perfect.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(1);

  const row9 = sheet.getRow(9);
  for (let i = 1; i <= 15; i++) {
    console.log(`Col ${i}: ${row9.getCell(i).value}`);
  }
}

read().catch(console.error);
