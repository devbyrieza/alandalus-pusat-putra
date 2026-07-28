const ExcelJS = require('exceljs');

async function inspect() {
  const wb1 = new ExcelJS.Workbook();
  await wb1.xlsx.readFile('file excel penting/Rekap_Uang_Pangkal_2026-07-21 (3).xlsx');
  const sheet1 = wb1.worksheets[0];
  console.log("--- Rekap Uang Pangkal ---");
  const row1 = sheet1.getRow(1).values;
  const row2 = sheet1.getRow(2).values;
  console.log("Row 1:", row1);
  console.log("Row 2:", row2);
  
  sheet1.eachRow((row, rowNum) => {
     if(rowNum <= 5) console.log(`Row ${rowNum}:`, row.values);
  });

  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile('file excel penting/data-pembayaran-daftar_ulang-2026-07-21 (3).xlsx');
  const sheet2 = wb2.worksheets[0];
  console.log("\n--- Data Pembayaran Daftar Ulang ---");
  const row1_2 = sheet2.getRow(1).values;
  const row2_2 = sheet2.getRow(2).values;
  console.log("Row 1:", row1_2);
  console.log("Row 2:", row2_2);
  
  sheet2.eachRow((row, rowNum) => {
     if(rowNum <= 5) console.log(`Row ${rowNum}:`, row.values);
  });
}
inspect().catch(console.error);
