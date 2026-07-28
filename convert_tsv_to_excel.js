const fs = require('fs');
const ExcelJS = require('exceljs');
const path = require('path');

async function convertTsvToExcel() {
  const tsvData = fs.readFileSync('raw_data.tsv', 'utf-8');
  const rows = tsvData.trim().split('\n').map(row => row.split('\t'));

  const workbook = new ExcelJS.Workbook();
  const headers = rows[0];
  const dataRows = rows.slice(1);

  const mtsRows = dataRows.filter(row => row[4] === 'MTs');
  const ilRows = dataRows.filter(row => row[4] === 'IL');

  function createSheet(sheetName, data, jenjang) {
    const sheet = workbook.addWorksheet(sheetName);

    // Title Rows
    sheet.mergeCells('A1:N1');
    const titleRow1 = sheet.getCell('A1');
    titleRow1.value = `DATA MONITORING PPDB ${jenjang} - AL ANDALUS AL IMAM`;
    titleRow1.font = { name: 'Arial', size: 14, bold: true };
    titleRow1.alignment = { vertical: 'middle', horizontal: 'center' };

    sheet.addRow([]); // Baris kosong

    // Headers (Row 3)
    const headerRow = sheet.getRow(3);
    headerRow.values = headers;
    
    // Style Headers
    for (let i = 1; i <= 14; i++) {
      const cell = headerRow.getCell(i);
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF064E3B' } }; // Hijau gelap
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    }

    // Set Column Widths
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

    // Add Data (Start from Row 4)
    for (let i = 0; i < data.length; i++) {
      const row = sheet.getRow(4 + i);
      const rowData = [...data[i]];
      rowData[0] = i + 1; // Reset nomor urut 1, 2, 3...
      
      // Menerapkan rekomendasi/solusi:
      rowData[7] = 'Diterima'; // Status Seleksi
      rowData[11] = 'Ya'; // Asrama
      rowData[12] = ''; // Bayar dikosongkan untuk dicek manual
      rowData[13] = ''; // Berkas dikosongkan untuk dicek manual

      row.values = rowData;

      // Borders and Alignment
      for (let colNumber = 1; colNumber <= 14; colNumber++) {
        const cell = row.getCell(colNumber);
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
        
        // Atur Alignment
        if ([1, 2, 3, 5, 6, 8, 12, 13, 14].includes(colNumber)) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        }

        // Tambahkan Data Validation (Dropdown) untuk kolom Bayar (13) dan Berkas (14)
        if (colNumber === 13) { // Bayar
          cell.dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: ['"Lunas,Cicilan,Belum"']
          };
        }
        if (colNumber === 14) { // Berkas
          cell.dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: ['"Lengkap,Belum Lengkap"']
          };
        }
      }
    }
  }

  createSheet('Data MTs', mtsRows, 'MTs');
  createSheet('Data IL', ilRows, 'I\'dad Lughowi (IL)');

  const fileName = 'Data_Monitoring_PPDB_AlImam_Final_V4.xlsx';
  const filePath = path.join(__dirname, fileName);
  await workbook.xlsx.writeFile(filePath);
  
  console.log(`Berhasil! File Excel telah dibuat di: ${filePath}`);
}

convertTsvToExcel().catch(console.error);
