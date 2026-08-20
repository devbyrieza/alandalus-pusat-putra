const ExcelJS = require('exceljs');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

async function main() {
  const dir = path.join(__dirname, '../Data_Santri_Kepengasuhan');
  
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Admin Al-Imam';
  
  // Load NIS Mapping
  const nisMapping = {};
  const nisFilePath = 'C:/Users/itpua/Dev/Work/al-andalus/safina-keuangan/Data_NIS_Santri_Baru_2026_Terpisah.xlsx';
  if (fs.existsSync(nisFilePath)) {
      const nisWb = xlsx.readFile(nisFilePath);
      nisWb.SheetNames.forEach(name => {
          const sheet = nisWb.Sheets[name];
          const data = xlsx.utils.sheet_to_json(sheet, {header: 1});
          data.forEach(row => {
              if (row[1] && row[3] && typeof row[1] === 'string' && row[1] !== 'Nama Santri') {
                  nisMapping[row[1].toLowerCase().trim()] = row[3];
              }
          });
      });
      console.log(`✅ Loaded ${Object.keys(nisMapping).length} NIS mappings.`);
  }
  
  const styleHeader = (worksheet, headers) => {
    worksheet.columns = headers.map(h => ({ header: h, key: h, width: Math.max((h || '').length + 5, 15) }));
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF800000' } }; 
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  };

  const files = [
    { name: 'Data Utama', file: 'DataSantri_AlImam_2026/2027_UTAMA.csv' },
    { name: 'Kesehatan & Asrama', file: 'DataSantri_AlImam_2026/2027_KESEHATAN.csv' },
    { name: 'Data Orang Tua', file: 'DataSantri_AlImam_2026/2027_ORANGTUA.csv' },
    { name: 'Rekap Asal', file: 'DataSantri_AlImam_2026/2027_REKAP_ASAL.csv' },
    { name: 'Kontak Darurat', file: 'DataSantri_AlImam_2026/2027_KONTAK.csv' },
  ];

  for (const f of files) {
    const csvPath = path.join(dir, f.file);
    if (!fs.existsSync(csvPath)) {
        console.log("File not found:", csvPath);
        continue;
    }
    
    const content = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
    
    let rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;
    
    for (let i = 0; i < content.length; i++) {
        let char = content[i];
        if (char === '"') {
            if (inQuotes && content[i+1] === '"') {
                currentCell += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell);
            currentCell = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && content[i+1] === '\n') i++;
            currentRow.push(currentCell);
            rows.push(currentRow);
            currentRow = [];
            currentCell = '';
        } else {
            currentCell += char;
        }
    }
    if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell);
        rows.push(currentRow);
    }
    
    rows = rows.filter(r => 
        r.some(c => c.trim() !== '') && 
        !r.some(c => typeof c === 'string' && (c.toLowerCase().includes('reiza tes') || c.toLowerCase().includes('ahmad sobari tes') || c.toLowerCase().includes(' test ')))
    );
    if (rows.length === 0) continue;

    const sheet = workbook.addWorksheet(f.name);
    
    if (f.name === 'Rekap Asal') {
        rows.forEach(r => sheet.addRow(r));
    } else {
        const headers = rows[0];
        styleHeader(sheet, headers);
        
        let dataRows = rows.slice(1);
        
        // Find index of Name column for sorting
        let nameIdx = headers.indexOf('Nama Lengkap');
        if (nameIdx === -1) nameIdx = headers.indexOf('Nama Santri');
        
        if (nameIdx !== -1) {
            dataRows.sort((a, b) => {
                const nameA = (a[nameIdx] || '').toLowerCase();
                const nameB = (b[nameIdx] || '').toLowerCase();
                return nameA.localeCompare(nameB);
            });
        }
        
        // Find index of NIS column
        let nisIdx = headers.indexOf('NIS');
        let statusIdx = headers.indexOf('Status Pendaftaran');
        let beasiswaIdx = headers.indexOf('Beasiswa/Keringanan');
        
        for (let i = 0; i < dataRows.length; i++) {
            dataRows[i][0] = i + 1; // Re-assign No.
            if (nisIdx !== -1 && nameIdx !== -1) {
                const sName = (dataRows[i][nameIdx] || '').toLowerCase().trim();
                if (nisMapping[sName]) {
                    dataRows[i][nisIdx] = nisMapping[sName];
                }
            }
            if (statusIdx !== -1) {
                dataRows[i][statusIdx] = 'DITERIMA';
            }
            if (beasiswaIdx !== -1) {
                let bVal = dataRows[i][beasiswaIdx] || '';
                if (typeof bVal === 'string' && bVal.toUpperCase().includes('BEASISWA')) {
                    dataRows[i][beasiswaIdx] = 'BEASISWA';
                }
            }
            sheet.addRow(dataRows[i]);
        }
    }
  }

  workbook.eachSheet((worksheet) => {
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
      });
    });
  });

  const outPath = path.join(dir, 'Data_Santri_AlImam_Kepengasuhan_2026/2027_V5.xlsx');
  await workbook.xlsx.writeFile(outPath);
  console.log('✅ File Excel berhasil dibuat:', outPath);
}

main().catch(console.error);
