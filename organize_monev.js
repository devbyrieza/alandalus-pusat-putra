const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'Berkas_Monev_PPDB_AlImam_2026');

// Buat folder jika belum ada
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
}

// Daftar file yang akan dipindah/copy beserta nama barunya agar terurut
const filesToCopy = [
    {
        src: 'Contoh_Formulir_Pendaftaran_Ad1.html',
        dest: '3_Contoh_Formulir_Pendaftaran_Ad1.html'
    },
    {
        src: 'Data_Monitoring_PPDB_AlImam_Final_V8.xlsx',
        dest: '4_Buku_Ad2_Data_Pendaftar_Awal.xlsx'
    },
    {
        src: 'Rekap_Hasil_Tes_AlImam_2026.xlsx',
        dest: '5_Rekap_Hasil_Tes_AlImam_2026.xlsx'
    },
    {
        src: 'Contoh_Surat_Kelulusan_PMB.html',
        dest: '6_Contoh_Surat_Kelulusan_PPDB.html'
    },
    {
        src: 'Data_Monitoring_PPDB_AlImam_Final_V8.xlsx',
        dest: '7_Buku_Ad3_Daftar_Murid_Diterima.xlsx'
    },
    {
        src: 'Laporan_Penerimaan_Santri_Baru_AlImam.html',
        dest: '8_Laporan_Penerimaan_Santri_Baru_AlImam.html'
    }
];

// Copy file
filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file.src);
    const destPath = path.join(targetDir, file.dest);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Berhasil menyalin: ${file.dest}`);
    } else {
        console.log(`Gagal menyalin: ${file.src} (File tidak ditemukan)`);
    }
});

// Buat file panduan
const readmeContent = `PANDUAN MENCETAK BERKAS MONEV PPDB 2026
--------------------------------------
Silakan buka folder ini dan print file-file di dalamnya secara berurutan:

Urutan 1: Print file 1_SK_Panitia_PPDB.html
Urutan 2: (Print brosur PPDB atau screenshot website)
Urutan 3: Print file 3_Contoh_Formulir_Pendaftaran_Ad1.html
Urutan 4: Print file 4_Buku_Ad2_Data_Pendaftar_Awal.xlsx
Urutan 5: Print file 5_Rekap_Hasil_Tes_AlImam_2026.xlsx
Urutan 6: Print file 6_Contoh_Surat_Kelulusan_PPDB.html
Urutan 7: Print file 7_Buku_Ad3_Daftar_Murid_Diterima.xlsx
Urutan 8: Print file 8_Laporan_Penerimaan_Santri_Baru_AlImam.html
Urutan 9: (Cari/Print 2-4 lembar foto dokumentasi saat tes)

Selamat Bekerja Ustadz!
`;
fs.writeFileSync(path.join(targetDir, 'PANDUAN_PRINT.txt'), readmeContent);
console.log('Selesai membuat folder dan menyalin file.');
