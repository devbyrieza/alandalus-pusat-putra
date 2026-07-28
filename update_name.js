const ExcelJS = require('exceljs');
const path = require('path');

async function updateName() {
  const filePath = path.join(__dirname, 'Pengajuan_Dana_MOSACUP_IT_Perfect.xlsx');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(1);

  // Update Name at Row 6
  const row6 = sheet.getRow(6);
  // In the screenshot, Nama: is Col 2, and the actual name is probably Col 3
  if (row6.getCell(3).value) {
    row6.getCell(3).value = 'Ketua Panitia MOSA CUP 2026';
  }

  // Update Signature name at the bottom
  // Usually around row 27. Let's scan rows 20 to 30 for the applicant's name
  for (let r = 20; r <= 30; r++) {
    const row = sheet.getRow(r);
    for (let c = 1; c <= 15; c++) {
      const cell = row.getCell(c);
      if (cell.value && typeof cell.value === 'string' && (cell.value.includes('Muhammad Iqbal') || cell.value.includes('Rieza Eka Tomara'))) {
        cell.value = 'Ketua Panitia MOSA CUP';
      }
    }
  }

  await workbook.xlsx.writeFile(filePath);
  console.log('Updated name to Ketua Panitia!');
}

updateName().catch(console.error);
