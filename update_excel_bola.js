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

  // Update Bola Sepak (Row 12 based on screenshot)
  const bolaRow = sheet.getRow(12);
  bolaRow.getCell(5).value = 100000;
  bolaRow.getCell(6).value = { formula: 'C12*E12', result: 100000 };

  // Calculate new total (assuming sum formula is SUM(F10:F18))
  // The formula in F19 will automatically recalculate if opened in Excel,
  // but let's just make sure the cached result is correct.
  // 150000 (VM) + 100000 (Bola) + 150000 (Voucher) + 105000 (Buku) + 30000 (Piala) + 35000 (Peluit)
  // Total = 570000
  const totalRow = sheet.getRow(19);
  totalRow.getCell(6).value = { formula: 'SUM(F10:F18)', result: 570000 };

  try {
    await workbook.xlsx.writeFile(filePath);
    console.log('Done modifying Perfect.xlsx with Bola = 100rb');
  } catch (err) {
    console.log("Could not write file. Close Excel first. " + err.message);
  }
}

update().catch(console.error);
