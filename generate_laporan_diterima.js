const fs = require('fs');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Penerimaan Santri Baru Al-Imam 2026</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 20px; font-size: 12pt; line-height: 1.5; }
        .container { max-width: 800px; margin: 0 auto; border: 1px solid #000; padding: 40px; background: #fff; }
        .header { text-align: center; border-bottom: 3px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .header h2, .header h3 { margin: 5px 0; }
        .title { text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 30px; text-decoration: underline; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #000; padding: 10px; text-align: center; }
        th { background-color: #f2f2f2; }
        .signature-area { margin-top: 60px; display: flex; justify-content: flex-end; }
        .sig-box { text-align: center; width: 40%; }
        .sig-name { margin-top: 70px; font-weight: bold; text-decoration: underline; }
        @media print { 
            body { padding: 0; background: #fff; }
            .container { border: none; padding: 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>YAYASAN AL ANDALUS AL IMAM</h2>
            <h3>PONDOK PESANTREN AL-IMAM AL-ISLAM</h3>
            <p style="margin: 0; font-size: 10pt;">Jl. Cikembang, Sukabumi, Jawa Barat</p>
        </div>
        
        <div class="title">LAPORAN REKAPITULASI PENERIMAAN MURID BARU <br> TAHUN AJARAN 2026/2027</div>

        <p style="text-align: justify; margin-bottom: 20px;">
            Berdasarkan hasil seleksi Penerimaan Murid Baru (PMB) Pondok Pesantren Al-Imam Al-Islam Tahun Ajaran 2026/2027 yang telah dilaksanakan pada tanggal 10 - 12 Juli 2026, bersama ini dilaporkan rekapitulasi jumlah calon santri yang dinyatakan <strong>DITERIMA</strong> dengan rincian sebagai berikut:
        </p>

        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Jenjang / Program</th>
                    <th>Jumlah Pendaftar</th>
                    <th>Jumlah Diterima</th>
                    <th>Keterangan</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td style="text-align: left;">MTs (Madrasah Tsanawiyah)</td>
                    <td>25</td>
                    <td><strong>19</strong> Santri</td>
                    <td>Seluruhnya Laki-laki</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td style="text-align: left;">I'dad Lughowi (IL)</td>
                    <td>28</td>
                    <td><strong>22</strong> Santri</td>
                    <td>Seluruhnya Laki-laki</td>
                </tr>
            </tbody>
            <tfoot>
                <tr style="font-weight: bold;">
                    <td colspan="2" style="text-align: right;">TOTAL KESELURUHAN</td>
                    <td>53</td>
                    <td>41 Santri</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>

        <p style="text-align: justify; margin-top: 20px;">
            Demikian laporan rekapitulasi penerimaan santri baru ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya. Daftar nama-nama santri yang diterima terlampir dalam Buku Ad-3 (Daftar Murid Baru).
        </p>

        <div class="signature-area">
            <div class="sig-box">
                <p>Sukabumi, 15 Juli 2026<br>Kepala Madrasah / Ketua PMB</p>
                <div class="sig-name">Retna Ningsih, S.Pd</div>
                <p style="margin:0;">NUPTK. 1234567890</p>
            </div>
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'Laporan_Penerimaan_Santri_Baru_AlImam.html'), htmlContent);
console.log('Berhasil membuat Laporan_Penerimaan_Santri_Baru_AlImam.html');
