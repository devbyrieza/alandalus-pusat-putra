const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function formatExcelFile(filename, isAd2, isAd3, isRekap) {
    const filePath = path.join(__dirname, 'Berkas_Monev_PPDB_AlImam_2026', filename);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }
    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    
    workbook.worksheets.forEach((worksheet) => {
        const sheetName = worksheet.name; // 'Data MTs' or 'Data IL'
        const isMTs = sheetName.includes('MTs');
        const jenjangText = isMTs ? "MTs" : "I'dad Lughowi (IL)";
        
        let title = '';
        if (isAd2) {
            title = `BUKU AD-2: DATA PENDAFTAR AWAL PPDB ${jenjangText.toUpperCase()} - PESANTREN AL-IMAM AL-ISLAMI`;
        } else if (isAd3) {
            title = `BUKU AD-3: DAFTAR MURID DITERIMA PPDB ${jenjangText.toUpperCase()} - PESANTREN AL-IMAM AL-ISLAMI`;
        } else if (isRekap) {
            title = `REKAPITULASI HASIL TES SELEKSI PPDB ${jenjangText.toUpperCase()} - PESANTREN AL-IMAM AL-ISLAMI`;
        }
        
        const subtitle = `TAHUN AJARAN 2026/2027`;
        const colCount = isRekap ? 13 : 14;
        
        // 1. Unmerge any existing merges in Row 1 and Row 2 to prevent merge conflicts
        if (worksheet.model && worksheet.model.merges) {
            const merges = [...worksheet.model.merges];
            merges.forEach(range => {
                // If the range starts on Row 1 or Row 2 (e.g., 'A1:N1', 'A2:K2')
                const startCell = range.split(':')[0];
                const startRow = parseInt(startCell.replace(/[^0-9]/g, ''));
                if (startRow === 1 || startRow === 2) {
                    try {
                        worksheet.unMergeCells(range);
                    } catch (e) {
                        // ignore unmerge errors
                    }
                }
            });
        }
        
        // 2. Clear values in Row 1 and Row 2 to prevent ghost text, then set A1 and A2
        for (let c = 1; c <= colCount; c++) {
            worksheet.getRow(1).getCell(c).value = null;
            worksheet.getRow(2).getCell(c).value = null;
        }
        worksheet.getCell('A1').value = title;
        worksheet.getCell('A2').value = subtitle;
        
        // 3. Merge Cells across the columns
        try {
            worksheet.mergeCells(1, 1, 1, colCount);
            worksheet.mergeCells(2, 1, 2, colCount);
        } catch (e) {
            console.warn('Merge failed:', e.message);
        }
        
        // 4. Format Row 1 (Title) - We must format EVERY cell in the merged range for background color!
        const row1 = worksheet.getRow(1);
        row1.height = 35;
        for (let c = 1; c <= colCount; c++) {
            const cell = row1.getCell(c);
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF550000' } // Maroon
            };
            cell.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
        
        // 5. Format Row 2 (Subtitle) - Format every cell
        const row2 = worksheet.getRow(2);
        row2.height = 22;
        for (let c = 1; c <= colCount; c++) {
            const cell = row2.getCell(c);
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDDC192' } // Krem Emas
            };
            cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF550000' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        }
        
        // 6. Format Row 3 (Headers)
        const row3 = worksheet.getRow(3);
        row3.height = 28;
        row3.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            // If it's the Berkas column (column 14) and it's empty, set header to 'Berkas'
            if (colNumber === 14 && (!cell.value || cell.value === '')) {
                cell.value = 'Berkas';
            }
            
            cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF550000' } // Maroon
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
                bottom: { style: 'medium', color: { argb: 'FF550000' } },
                right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
            };
        });
        
        // 7. Format Data Rows (Row 4+)
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 3) {
                row.height = 22;
                
                // Alternate row fill colors
                const isEven = rowNumber % 2 === 0;
                const rowBgColor = isEven ? 'FFFDF9F3' : 'FFFFFFFF'; // Soft cream / White
                
                // Set 'Lengkap' for column 14 (Berkas) if it's Ad2 or Ad3 files
                if ((isAd2 || isAd3) && row.getCell(14)) {
                    const berkasCell = row.getCell(14);
                    if (!berkasCell.value || berkasCell.value === '') {
                        berkasCell.value = 'Lengkap';
                    }
                }
                
                // Convert L/P to Laki-laki/Perempuan in column 6 (Jns Kelamin)
                if ((isAd2 || isAd3) && row.getCell(6)) {
                    const jkCell = row.getCell(6);
                    if (jkCell.value === 'L') {
                        jkCell.value = 'Laki-laki';
                    } else if (jkCell.value === 'P') {
                        jkCell.value = 'Perempuan';
                    }
                }
                
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    cell.font = { name: 'Arial', size: 10, color: { argb: 'FF000000' } };
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: rowBgColor }
                    };
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
                        right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
                    };
                    
                    // Specific column alignments
                    const centerCols = [1, 2, 3, 5, 6, 9, 10, 11, 12, 13, 14];
                    const valStr = cell.value ? cell.value.toString() : '';
                    
                    if (centerCols.includes(colNumber) || typeof cell.value === 'number' || valStr.length < 5) {
                        cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    } else {
                        cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
                    }
                });
            }
        });
        
        // 8. Auto-fit column widths
        worksheet.columns.forEach((column, colNumber) => {
            let maxLen = 10;
            column.eachCell({ includeEmpty: true }, (cell) => {
                if (cell.row > 2 && cell.value) {
                    const len = cell.value.toString().length;
                    if (len > maxLen) maxLen = len;
                }
            });
            column.width = Math.min(maxLen + 3, 40);
        });
        
        // Print setup for professional landscape A4 layout
        worksheet.pageSetup = {
            orientation: 'landscape',
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0,
            margins: {
                left: 0.4, right: 0.4,
                top: 0.5, bottom: 0.5,
                header: 0.2, footer: 0.2
            },
            paperSize: 9 // A4
        };
    });
    
    await workbook.xlsx.writeFile(filePath);
    console.log(`Successfully formatted ${filename} with Al-Imam brand identity!`);
}

async function run() {
    try {
        await formatExcelFile('4_Buku_Ad2_Data_Pendaftar_Awal.xlsx', true, false, false);
        await formatExcelFile('5_Rekap_Hasil_Tes_AlImam_2026.xlsx', false, false, true);
        await formatExcelFile('7_Buku_Ad3_Daftar_Murid_Diterima.xlsx', false, true, false);
        console.log('Semua file Excel PPDB Al-Imam berhasil diformat!');
    } catch (err) {
        console.error("Gagal format excel:", err);
    }
}

run();
