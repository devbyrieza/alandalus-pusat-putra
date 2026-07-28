const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function convert() {
  const xlsxPath = path.join(__dirname, '..', 'public', 'documents', 'Data Pendaftar - dari web.xlsx');
  const csvPath = path.join(__dirname, '..', 'public', 'documents', 'Data_Pendaftar_dari_web.csv');

  console.log('Membaca Excel...');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);

  let sheet = workbook.getWorksheet('Data_Pendaftar_20260702_171349') || workbook.worksheets.find(s => s.rowCount > 0);
  if (!sheet) {
    console.error('Sheet tidak ditemukan!');
    return;
  }

  const csvRows = [];
  sheet.eachRow((row) => {
    const values = [];
    // Looping kolom 1-11 untuk memastikan tidak ada cell kosong yang terlewat (menghindari sparse array)
    for (let i = 1; i <= 11; i++) {
      const cell = row.getCell(i);
      const val = cell.value;
      if (val === null || val === undefined) {
        values.push('""');
      } else {
        let str = typeof val === 'object' ? (val.text || val.toString()) : String(val);
        str = str.replace(/"/g, '""'); // Escape double quotes
        values.push(`"${str}"`);
      }
    }
    csvRows.push(values.join(','));
  });

  fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf-8');
  console.log(`Berhasil dikonversi ke CSV di: ${csvPath}`);
}

convert().catch(console.error);
