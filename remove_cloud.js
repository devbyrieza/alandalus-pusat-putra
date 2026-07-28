const ExcelJS = require('exceljs');
const path = require('path');

async function fix() {
  const filePath = path.join(__dirname, 'Pengajuan_Dana_MOSACUP_IT_Perfect.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(1);

  // Remove row 10 (Perpanjangan Cloud Server VM)
  sheet.spliceRows(10, 1);

  // After splicing, the items are at rows 11 to 16
  // Row 11: Bola
  // Row 12: Voucher Tim
  // Row 13: Voucher Individu
  // Row 14: Piala
  // Row 15: Peluit
  // Row 16: Snack

  // Update the Numbering and Formulas
  for (let i = 11; i <= 16; i++) {
    const row = sheet.getRow(i);
    row.getCell(2).value = i - 10;
    // Update the formula to match the new row number
    const hargaStr = row.getCell(9).value;
    const result = hargaStr * row.getCell(6).value;
    row.getCell(10).value = { formula: `F${i}*I${i}`, result: result };
  }

  // Row 18 is now the total row
  const totalRow = sheet.getRow(18);
  totalRow.getCell(10).value = { formula: 'SUM(J10:J17)', result: 305000 };

  await workbook.xlsx.writeFile(filePath);
  console.log('Removed Cloud Server and shifted rows!');
}

fix().catch(console.error);
