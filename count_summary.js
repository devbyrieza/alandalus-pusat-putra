const ExcelJS = require('exceljs');

async function countSummary() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('Data_Monitoring_PPDB_AlImam_Final_V8.xlsx');
  
  let mts = 0, il = 0;
  
  const sheetMTs = wb.getWorksheet('Data MTs');
  if(sheetMTs) {
    sheetMTs.eachRow((row, num) => {
      if(num >= 4 && row.getCell(2).value) mts++;
    });
  }

  const sheetIL = wb.getWorksheet('Data IL');
  if(sheetIL) {
    sheetIL.eachRow((row, num) => {
      if(num >= 4 && row.getCell(2).value) il++;
    });
  }

  console.log(`Summary: MTs = ${mts}, IL = ${il}, Total = ${mts+il}`);
}
countSummary().catch(console.error);
