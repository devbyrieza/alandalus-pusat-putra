const ExcelJS = require('exceljs');

async function inspect() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('Bahan_ID_Card_AlImam/03_Data_Santri_Fix.xlsx');
  const sheet = wb.worksheets[0];
  
  sheet.eachRow((row, rowNumber) => {
    if(row.getCell(6).value && row.getCell(6).value.toString().includes('IL')) {
      console.log(`Row ${rowNumber}:`, row.values);
    }
  });
}
inspect().catch(console.error);
