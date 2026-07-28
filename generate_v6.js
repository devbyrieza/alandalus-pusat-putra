const fs = require('fs');
const ExcelJS = require('exceljs');
const path = require('path');

async function convertTsvToExcel() {
  const idCardWb = new ExcelJS.Workbook();
  await idCardWb.xlsx.readFile('Bahan_ID_Card_AlImam/03_Data_Santri_Fix.xlsx');
  const idCardSheet = idCardWb.worksheets[0];
  
  const nisMap = new Map();
  let maxNisMTs = 0;
  let maxNisIL = 0;
  
  const prefixMTs = '260107'; 
  const prefixIL = '260207'; 

  idCardSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; 
    
    const nis = (row.getCell(3).value || '').toString().trim();
    const nama = (row.getCell(5).value || '').toString().trim().toLowerCase();

    if (nama && nis && nis !== '-') {
      nisMap.set(nama, nis);
      
      // Deteksi max berdasar prefix
      if (nis.startsWith(prefixMTs)) {
        const numPart = parseInt(nis.slice(-4), 10);
        if (!isNaN(numPart) && numPart > maxNisMTs) maxNisMTs = numPart;
      } else if (nis.startsWith(prefixIL)) {
        const numPart = parseInt(nis.slice(-4), 10);
        if (!isNaN(numPart) && numPart > maxNisIL) maxNisIL = numPart;
      }
    }
  });

  // Jika tidak ada data IL di excel lama yang punya awalan 260207, kita mulai dari 0
  if (maxNisIL === 0) maxNisIL = 0;

  const tsvData = fs.readFileSync('raw_data.tsv', 'utf-8');
  const rows = tsvData.trim().split('\n').map(row => row.split('\t'));

  const headers = rows[0];
  const dataRows = rows.slice(1);

  for (const row of dataRows) {
    const nama = (row[3] || '').toString().trim().toLowerCase();
    const jenjang = row[4]; 

    if (nisMap.has(nama) && nisMap.get(nama).startsWith('26')) {
      row[1] = nisMap.get(nama); 
    } else {
      if (jenjang === 'MTs') {
        maxNisMTs++;
        row[1] = prefixMTs + maxNisMTs.toString().padStart(4, '0');
      } else { 
        maxNisIL++;
        row[1] = prefixIL + maxNisIL.toString().padStart(4, '0');
      }
    }
  }

  const workbook = new ExcelJS.Workbook();
  const mtsRows = dataRows.filter(row => row[4] === 'MTs');
  const ilRows = dataRows.filter(row => row[4] === 'IL');

  function createSheet(sheetName, data, jenjang) {
    const sheet = workbook.addWorksheet(sheetName);
    sheet.mergeCells('A1:N1');
    const titleRow1 = sheet.getCell('A1');
    titleRow1.value = `DATA MONITORING PPDB ${jenjang} - AL ANDALUS AL IMAM`;
    titleRow1.font = { name: 'Arial', size: 14, bold: true };
    titleRow1.alignment = { vertical: 'middle', horizontal: 'center' };

    sheet.addRow([]);

    const headerRow = sheet.getRow(3);
    headerRow.values = headers;
    
    for (let i = 1; i <= 14; i++) {
      const cell = headerRow.getCell(i);
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF064E3B' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    }

    sheet.getColumn(1).width = 5;
    sheet.getColumn(2).width = 15;
    sheet.getColumn(3).width = 25;
    sheet.getColumn(4).width = 35;
    sheet.getColumn(5).width = 10;
    sheet.getColumn(6).width = 15;
    sheet.getColumn(7).width = 30;
    sheet.getColumn(8).width = 15;
    sheet.getColumn(9).width = 25;
    sheet.getColumn(10).width = 25;
    sheet.getColumn(11).width = 20;
    sheet.getColumn(12).width = 10;
    sheet.getColumn(13).width = 15;
    sheet.getColumn(14).width = 15;

    for (let i = 0; i < data.length; i++) {
      const row = sheet.getRow(4 + i);
      const rowData = [...data[i]];
      rowData[0] = i + 1;
      
      rowData[7] = 'Diterima'; 
      rowData[11] = 'Ya'; 
      rowData[12] = ''; 
      rowData[13] = ''; 

      row.values = rowData;

      for (let colNumber = 1; colNumber <= 14; colNumber++) {
        const cell = row.getCell(colNumber);
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        if ([1, 2, 3, 5, 6, 8, 12, 13, 14].includes(colNumber)) cell.alignment = { vertical: 'middle', horizontal: 'center' };
        else cell.alignment = { vertical: 'middle', horizontal: 'left' };
        if (colNumber === 13) cell.dataValidation = { type: 'list', allowBlank: true, formulae: ['"Lunas,Cicilan,Belum"'] };
        if (colNumber === 14) cell.dataValidation = { type: 'list', allowBlank: true, formulae: ['"Lengkap,Belum Lengkap"'] };
      }
    }
  }

  createSheet('Data MTs', mtsRows, 'MTs');
  createSheet('Data IL', ilRows, 'I\'dad Lughowi (IL)');

  const fileName = 'Data_Monitoring_PPDB_AlImam_Final_V6.xlsx';
  const filePath = path.join(__dirname, fileName);
  await workbook.xlsx.writeFile(filePath);
  
  console.log(`Berhasil! File Excel telah dibuat di: ${filePath}`);
}

convertTsvToExcel().catch(console.error);
