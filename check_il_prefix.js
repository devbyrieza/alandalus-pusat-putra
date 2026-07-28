const ExcelJS = require('exceljs');

async function check() {
  const idCardWb = new ExcelJS.Workbook();
  await idCardWb.xlsx.readFile('Bahan_ID_Card_AlImam/03_Data_Santri_Fix.xlsx');
  const idCardSheet = idCardWb.worksheets[0];
  
  let prefixMTs = '260107'; 
  let prefixIL = '260207'; 
  let maxNisIL = 0;

  idCardSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; 
    
    const nis = (row.getCell(3).value || '').toString().trim();
    const nama = (row.getCell(5).value || '').toString().trim().toLowerCase();
    const kelas = (row.getCell(6).value || '').toString().trim();

    if (nama && nis && nis !== '-') {
      const numPart = parseInt(nis.slice(-4), 10);
      if (!isNaN(numPart)) {
        if (kelas === 'IL' || kelas.includes('IL')) {
          console.log(`Found IL: ${nama} | NIS: ${nis} | Kelas: ${kelas}`);
          prefixIL = nis.substring(0, nis.length - 4);
          if (numPart > maxNisIL) maxNisIL = numPart;
        }
      }
    }
  });
  console.log('Final prefixIL:', prefixIL, 'maxNisIL:', maxNisIL);
}
check().catch(console.error);
