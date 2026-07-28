const fs = require('fs');
const ExcelJS = require('exceljs');

function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

async function processAlimam() {
  const dbCsvPath = 'c:/Users/itpua/Dev/Work/al-andalus/alimam_db_students_utf8.csv';
  const existingExcelPath = 'c:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/Data_NIS_Santri_Baru_2026_Terpisah.xlsx';
  const finalExcelPath = 'c:/Users/itpua/Dev/Work/al-andalus/Data_NIS_Santri_Alimam_Pisah_Sheet.xlsx';

  // Excluded names
  const excludedNames = [
    'reiza tes',
    'ahmad sobari tes',
    'ahmad sukari tes',
    'ahmad tes',
    'daud tes',
    'rifqi arsyad fadilah'
  ];

  // 1. Read existing Excel file
  const existingWb = new ExcelJS.Workbook();
  await existingWb.xlsx.readFile(existingExcelPath);
  
  const existingNisMap = {}; 
  const maxNisPerJenjang = {};

  existingWb.eachSheet((worksheet) => {
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 4) {
        const values = row.values;
        if (values && values.length >= 5) {
          const nama = (values[2] || '').toString().trim().toLowerCase();
          const jenjang = (values[3] || '').toString().trim();
          const nis = (values[4] || '').toString().trim();
          
          if (nama && jenjang && nis) {
            existingNisMap[`${jenjang.toUpperCase()}_${nama}`] = nis;
            
            const nisNum = BigInt(nis);
            const jenjangUpper = jenjang.toUpperCase();
            if (!maxNisPerJenjang[jenjangUpper] || nisNum > maxNisPerJenjang[jenjangUpper]) {
              maxNisPerJenjang[jenjangUpper] = nisNum;
            }
          }
        }
      }
    });
  });

  // 2. Read DB CSV
  const dbCsvData = fs.readFileSync(dbCsvPath, 'utf8');
  const dbRows = dbCsvData.trim().split('\n').slice(1); // skip header
  
  const students = [];
  
  dbRows.forEach(line => {
    const cols = line.split(',');
    if (cols.length >= 3) {
      let rawNama = cols[1].replace(/"/g, '').trim();
      let namaLower = rawNama.toLowerCase();
      const jenjang = cols[2].replace(/"/g, '').trim().toUpperCase();
      
      if (!excludedNames.includes(namaLower) && !namaLower.endsWith(' tes')) {
        const titleCaseNama = toTitleCase(rawNama);
        students.push({ nama: titleCaseNama, jenjang, rawNamaLower: namaLower });
      }
    }
  });

  // Add Zakaria explicitly
  const zakariaName = 'Zakaria Reynaldo';
  const zakariaLower = zakariaName.toLowerCase();
  if (!students.find(s => s.rawNamaLower === zakariaLower)) {
    students.push({
      nama: toTitleCase(zakariaName),
      jenjang: 'IL',
      rawNamaLower: zakariaLower
    });
  }

  // Group by jenjang
  const groupedStudents = {};
  students.forEach(student => {
    if (!groupedStudents[student.jenjang]) {
      groupedStudents[student.jenjang] = [];
    }
    groupedStudents[student.jenjang].push(student);
  });

  // Assign NIS
  const finalData = {}; // Object with Jenjang as keys
  
  for (const jenjang of Object.keys(groupedStudents)) {
    // Sort alphabetically by nama
    groupedStudents[jenjang].sort((a, b) => a.nama.localeCompare(b.nama));
    
    let currentMaxNis = maxNisPerJenjang[jenjang] || BigInt(0);
    finalData[jenjang] = [];
    
    for (const student of groupedStudents[jenjang]) {
      const key = `${jenjang}_${student.rawNamaLower}`;
      let assignedNis = existingNisMap[key];
      
      if (!assignedNis) {
        // Generate new NIS
        currentMaxNis += BigInt(1);
        assignedNis = currentMaxNis.toString();
        student.isNewNis = true;
      }
      
      finalData[jenjang].push({
        nis: assignedNis,
        nama: student.nama,
        jenjang: student.jenjang
      });
    }
  }

  // 3. Create Styled Final Excel File with Separate Sheets
  const finalWb = new ExcelJS.Workbook();
  
  for (const jenjang of Object.keys(finalData).sort()) {
    const ws = finalWb.addWorksheet(jenjang, {
      properties: { defaultRowHeight: 20 }
    });

    ws.columns = [
      { header: 'NIS', key: 'nis', width: 25 },
      { header: 'Nama Lengkap', key: 'nama', width: 45 },
      { header: 'Jenjang', key: 'jenjang', width: 15 }
    ];

    // Style header row (Maroon #800000)
    const headerRow = ws.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF800000' } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12, name: 'Arial' };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' }
      };
    });
    headerRow.height = 30;

    // Add Data
    finalData[jenjang].forEach(data => {
      const row = ws.addRow([data.nis, data.nama, data.jenjang]);
      row.eachCell((cell) => {
        cell.font = { name: 'Arial', size: 11 };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        if (cell.col === 3 || cell.col === 1) { 
          cell.alignment.horizontal = 'center';
        }
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
      });
    });
  }

  await finalWb.xlsx.writeFile(finalExcelPath);
  console.log('Final Excel file created at:', finalExcelPath);
}

processAlimam().catch(console.error);
