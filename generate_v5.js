const fs = require('fs');
const ExcelJS = require('exceljs');
const path = require('path');

async function convertTsvToExcel() {
  // 1. Baca data ID Card lama untuk mengambil mapping Nama -> NIS dan mencari nilai maksimum NIS
  const idCardWb = new ExcelJS.Workbook();
  await idCardWb.xlsx.readFile('Bahan_ID_Card_AlImam/03_Data_Santri_Fix.xlsx');
  const idCardSheet = idCardWb.worksheets[0];
  
  const nisMap = new Map();
  let maxNisMTs = 0;
  let maxNisIL = 0;
  
  let prefixMTs = '260107'; 
  let prefixIL = '260207'; 

  idCardSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header
    
    // Index 3: Nomor Identitas 1 (NIS)
    // Index 5: Nama
    // Index 6: Kelas
    const nis = (row.getCell(3).value || '').toString().trim();
    const nama = (row.getCell(5).value || '').toString().trim().toLowerCase();
    const kelas = (row.getCell(6).value || '').toString().trim();

    if (nama && nis && nis !== '-') {
      nisMap.set(nama, nis);
      
      const numPart = parseInt(nis.slice(-4), 10);
      if (!isNaN(numPart)) {
        if (kelas === 'MTs') {
          prefixMTs = nis.substring(0, nis.length - 4);
          if (numPart > maxNisMTs) maxNisMTs = numPart;
        } else if (kelas === 'IL' || kelas.includes('IL')) {
          prefixIL = nis.substring(0, nis.length - 4);
          if (numPart > maxNisIL) maxNisIL = numPart;
        }
      }
    }
  });

  // 2. Baca raw_data.tsv dan update NIS
  const tsvData = fs.readFileSync('raw_data.tsv', 'utf-8');
  const rows = tsvData.trim().split('\n').map(row => row.split('\t'));

  const headers = rows[0];
  const dataRows = rows.slice(1);

  // Proses data: Update NIS dari map atau generate baru
  for (const row of dataRows) {
    const nama = (row[3] || '').toString().trim().toLowerCase();
    const jenjang = row[4]; // MTs atau IL

    if (nisMap.has(nama)) {
      row[1] = nisMap.get(nama); // Set NIS dari file ID card
    } else {
      // Generate NIS baru
      if (jenjang === 'MTs') {
        maxNisMTs++;
        const newNis = prefixMTs + maxNisMTs.toString().padStart(4, '0');
        row[1] = newNis;
      } else { // IL
        maxNisIL++;
        const newNis = prefixIL + maxNisIL.toString().padStart(4, '0');
        row[1] = newNis;
      }
    }
  }

  // 3. Buat Excel
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
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
        
        if ([1, 2, 3, 5, 6, 8, 12, 13, 14].includes(colNumber)) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        }

        if (colNumber === 13) {
          cell.dataValidation = { type: 'list', allowBlank: true, formulae: ['"Lunas,Cicilan,Belum"'] };
        }
        if (colNumber === 14) {
          cell.dataValidation = { type: 'list', allowBlank: true, formulae: ['"Lengkap,Belum Lengkap"'] };
        }
      }
    }
  }

  createSheet('Data MTs', mtsRows, 'MTs');
  createSheet('Data IL', ilRows, 'I\'dad Lughowi (IL)');

  const fileName = 'Data_Monitoring_PPDB_AlImam_Final_V5.xlsx';
  const filePath = path.join(__dirname, fileName);
  await workbook.xlsx.writeFile(filePath);
  
  console.log(`Berhasil! File Excel telah dibuat di: ${filePath}`);
}

convertTsvToExcel().catch(console.error);
