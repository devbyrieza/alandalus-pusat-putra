const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

// Read and build name score map from database dump
const nameScoreMap = new Map();
const dbDumpPath = path.join(__dirname, 'nilai_db.jsonl');

if (fs.existsSync(dbDumpPath)) {
  const content = fs.readFileSync(dbDumpPath, 'utf8');
  const lines = content.trim().split('\n');
  lines.forEach(line => {
    if (!line.trim()) return;
    try {
      const data = JSON.parse(line.replace(/^\uFEFF/, '')); // remove BOM if present
      if (data.nama_lengkap) {
        const key = data.nama_lengkap.toLowerCase().trim().replace(/\s+/g, ' ');
        nameScoreMap.set(key, data);
      }
    } catch(e) {
      console.warn("Error parsing JSONL line:", e.message);
    }
  });
  console.log(`Loaded ${nameScoreMap.size} students' scores from database dump!`);
} else {
  console.warn("nilai_db.jsonl not found, using default scores only.");
}

function getScores(nama) {
  const key = nama.toLowerCase().trim().replace(/\s+/g, ' ');
  const dbData = nameScoreMap.get(key);
  
  // Standard default values requested by user
  let akademik = 80;
  let kepribadian = 52;
  let kesiapan = 80;
  let quran = 80;
  let wawancara_santri = 85;
  let wawancara_ortu = 85;
  
  if (dbData) {
    if (dbData.score_akademik !== null && dbData.score_akademik !== undefined) akademik = Number(dbData.score_akademik);
    if (dbData.score_kepribadian !== null && dbData.score_kepribadian !== undefined) kepribadian = Number(dbData.score_kepribadian);
    if (dbData.score_kesiapan !== null && dbData.score_kesiapan !== undefined) kesiapan = Number(dbData.score_kesiapan);
    if (dbData.score_quran !== null && dbData.score_quran !== undefined) quran = Number(dbData.score_quran);
    
    // Wawancara santri
    const wsVal = dbData.nilai_wawancara_santri !== null ? dbData.nilai_wawancara_santri : dbData.score_wawancara;
    if (wsVal !== null && wsVal !== undefined) wawancara_santri = Number(wsVal);
    
    // Wawancara ortu
    if (dbData.nilai_wawancara_ortu !== null && dbData.nilai_wawancara_ortu !== undefined) wawancara_ortu = Number(dbData.nilai_wawancara_ortu);
  }
  
  // Round to nearest integer for clean presentation
  akademik = Math.round(akademik);
  kepribadian = Math.round(kepribadian);
  kesiapan = Math.round(kesiapan);
  quran = Math.round(quran);
  wawancara_santri = Math.round(wawancara_santri);
  wawancara_ortu = Math.round(wawancara_ortu);

  const total = akademik + kepribadian + kesiapan + quran + wawancara_santri + wawancara_ortu;
  const rata = (total / 6).toFixed(2);
  
  return { akademik, kepribadian, kesiapan, quran, wawancara_santri, wawancara_ortu, total, rata };
}

async function generateRekapTes() {
  const wbIn = new ExcelJS.Workbook();
  await wbIn.xlsx.readFile('Data_Monitoring_PPDB_AlImam_Final_V8.xlsx');
  
  const wbOut = new ExcelJS.Workbook();
  
  function processSheet(sheetName, jenjang) {
    const sheetIn = wbIn.getWorksheet(sheetName);
    if (!sheetIn) return;

    const sheetOut = wbOut.addWorksheet(sheetName);
    
    // Title placeholder - actual formatting is handled by format_excels.js
    sheetOut.mergeCells('A1:M1');
    const title = sheetOut.getCell('A1');
    title.value = `REKAPITULASI HASIL TES SELEKSI PPDB ${jenjang.toUpperCase()} - PESANTREN AL-IMAM AL-ISLAMI`;
    title.font = { name: 'Arial', size: 14, bold: true };
    title.alignment = { vertical: 'middle', horizontal: 'center' };
    
    sheetOut.addRow([]);

    // Headers with 13 columns (including all 6 score parameters)
    const headers = [
      'No', 'NIS', 'Nama Lengkap', 'Asal Sekolah', 
      'Akademik', 'Kepribadian', 'Kesiapan', 'Al-Quran', 'Wawancara Santri', 'Wawancara Ortu',
      'Total Nilai', 'Rata-Rata', 'Keterangan'
    ];
    const headerRow = sheetOut.getRow(3);
    headerRow.values = headers;
    
    for (let i = 1; i <= 13; i++) {
      const cell = headerRow.getCell(i);
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004B87' } }; // Biru gelap (will be formatted to Maroon by format_excels)
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    }

    // Set Column Widths
    sheetOut.getColumn(1).width = 5;   // No
    sheetOut.getColumn(2).width = 15;  // NIS
    sheetOut.getColumn(3).width = 30;  // Nama Lengkap
    sheetOut.getColumn(4).width = 30;  // Asal Sekolah
    sheetOut.getColumn(5).width = 12;  // Akademik
    sheetOut.getColumn(6).width = 12;  // Kepribadian
    sheetOut.getColumn(7).width = 12;  // Kesiapan
    sheetOut.getColumn(8).width = 12;  // Al-Quran
    sheetOut.getColumn(9).width = 16;  // Wawancara Santri
    sheetOut.getColumn(10).width = 16; // Wawancara Ortu
    sheetOut.getColumn(11).width = 12; // Total
    sheetOut.getColumn(12).width = 12; // Rata-Rata
    sheetOut.getColumn(13).width = 12; // Keterangan

    let rowNumOut = 4;
    // Iterate through V8
    sheetIn.eachRow((row, rowNumIn) => {
      if (rowNumIn >= 4 && row.getCell(2).value) {
        const no = row.getCell(1).value;
        const nis = row.getCell(2).value;
        const nama = row.getCell(4).value;
        const asal = row.getCell(7).value;

        // Fetch real database scores or fall back to standard scores
        const s = getScores(nama);
        
        const rowOut = sheetOut.getRow(rowNumOut++);
        rowOut.values = [
          no, nis, nama, asal, 
          s.akademik, s.kepribadian, s.kesiapan, s.quran, s.wawancara_santri, s.wawancara_ortu,
          s.total, Number(s.rata), 'LULUS'
        ];

        for (let i = 1; i <= 13; i++) {
          const cell = rowOut.getCell(i);
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          if ([1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13].includes(i)) {
             cell.alignment = { vertical: 'middle', horizontal: 'center' };
          } else {
             cell.alignment = { vertical: 'middle', horizontal: 'left' };
          }
        }
      }
    });

    // Add signature space - aligned to the right (columns K to M)
    rowNumOut += 2;
    sheetOut.mergeCells(`K${rowNumOut}:M${rowNumOut}`);
    sheetOut.getCell(`K${rowNumOut}`).value = 'Sukabumi, 15 Juli 2026';
    sheetOut.getCell(`K${rowNumOut}`).alignment = { horizontal: 'center' };
    
    rowNumOut++;
    sheetOut.mergeCells(`K${rowNumOut}:M${rowNumOut}`);
    sheetOut.getCell(`K${rowNumOut}`).value = 'Mudir Pondok Pesantren / Ketua PPDB';
    sheetOut.getCell(`K${rowNumOut}`).alignment = { horizontal: 'center' };

    rowNumOut += 4;
    sheetOut.mergeCells(`K${rowNumOut}:M${rowNumOut}`);
    sheetOut.getCell(`K${rowNumOut}`).value = 'Wahab Rajasam, M.Pd';
    sheetOut.getCell(`K${rowNumOut}`).font = { bold: true, underline: true };
    sheetOut.getCell(`K${rowNumOut}`).alignment = { horizontal: 'center' };
  }

  processSheet('Data MTs', 'MTs');
  processSheet('Data IL', 'I\'dad Lughowi');

  const filePath = path.join(__dirname, 'Rekap_Hasil_Tes_AlImam_2026.xlsx');
  await wbOut.xlsx.writeFile(filePath);
  console.log('Berhasil membuat Rekap_Hasil_Tes_AlImam_2026.xlsx dengan nilai real database!');
}

generateRekapTes().catch(console.error);
