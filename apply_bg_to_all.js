const fs = require('fs');
const path = require('path');

function getBase64(filePath) {
    if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath).substring(1);
        const data = fs.readFileSync(filePath).toString('base64');
        return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${data}`;
    }
    return '';
}

const bgPath = path.join(__dirname, 'public/images/kop-surat-clean.jpg'); 
const ttdPath = path.join(__dirname, 'public/images/ttd-mudir.png'); // Ustadz Wahab
const ttdBuRetnaPath = path.join(__dirname, 'public/images/ttd-muhlis.png'); // Fallback if no Bu Retna sig, we use what we have or just name. Actually I will just leave Bu Retna's sig blank if we don't have it, or use the stamp.
// Wait, the user has 'ttd-mudir.png' which is Wahab. Does he have Retna's?
const stempelPath = path.join(__dirname, 'public/documents/Stempel 5.png'); 

const bgBase64 = getBase64(bgPath);
const ttdBase64 = getBase64(ttdPath);
const stempelBase64 = getBase64(stempelPath);
// Let's not embed fake signatures for Bu Retna if we don't have it, we'll just put the stamp and the name.
// Actually, earlier in generate_laporan_diterima.js there was no image, just text for Bu Retna.

const commonStyle = `
        body { 
            font-family: 'Times New Roman', Times, serif; 
            margin: 0; 
            padding: 20px; 
            font-size: 11.5pt; 
            line-height: 1.3; 
            background: #e0e0e0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .container { 
            width: 794px; /* A4 Width */
            height: 1123px; /* A4 Height */
            margin: 0 auto; 
            padding: 0; 
            background: #fff; 
            background-image: url('${bgBase64}');
            background-size: 100% 100%;
            background-position: top center;
            background-repeat: no-repeat;
            position: relative;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            box-sizing: border-box;
            overflow: hidden;
        }
        .content-area {
            padding: 265px 80px 30px 80px; 
            position: relative;
            z-index: 2;
        }
        .ttd-space {
            position: relative;
            height: 80px;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .stempel-img {
            position: absolute;
            top: -20px;
            left: -45px;
            width: 110px;
            z-index: 9;
            opacity: 0.85; 
            mix-blend-mode: multiply;
        }
        .ttd-img {
            position: absolute;
            top: 5px;
            left: 25px;
            width: 140px;
            z-index: 10;
            mix-blend-mode: multiply;
        }
        @media print { 
            body { padding: 0; background: #fff; } 
            .container { box-shadow: none; }
        }
`;

// 1. AD-1 (FORMULIR PENDAFTARAN)
const ad1Html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Formulir Pendaftaran Ad-1</title>
    <style>
        ${commonStyle}
        .judul { text-align: center; margin-bottom: 20px; }
        .judul h3 { margin: 0; font-size: 14pt; text-decoration: underline; font-weight: bold; }
        .judul p { margin: 5px 0 0 0; font-weight: bold; }
        table.form-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        table.form-table td { padding: 5px; vertical-align: top; border-bottom: 1px dotted #ccc; }
        .section-title { font-weight: bold; text-decoration: underline; margin-top: 15px; margin-bottom: 10px; }
        .ttd-table { width: 100%; margin-top: 40px; text-align: center; }
        .ttd-table td { width: 50%; padding-top: 60px; font-weight: bold; text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="content-area" style="padding-top: 200px;">
            <div class="judul">
                <h3>FORMULIR PENDAFTARAN SANTRI BARU (AD-1)</h3>
                <p>TAHUN AJARAN 2026/2027</p>
            </div>

            <div class="section-title">A. IDENTITAS CALON SANTRI</div>
            <table class="form-table">
                <tr><td width="5%">1.</td><td width="35%">Nomor Pendaftaran</td><td width="2%">:</td><td>MTA2600001</td></tr>
                <tr><td>2.</td><td>Nama Lengkap</td><td>:</td><td><strong>ATQANUL UMMAH AHMAD</strong></td></tr>
                <tr><td>3.</td><td>NIK</td><td>:</td><td>7371111406140004</td></tr>
                <tr><td>4.</td><td>Tempat, Tanggal Lahir</td><td>:</td><td>KAB. SUKABUMI, 14 Juni 2014</td></tr>
                <tr><td>5.</td><td>Jenis Kelamin</td><td>:</td><td>Laki-Laki</td></tr>
                <tr><td>6.</td><td>Alamat Lengkap</td><td>:</td><td>Jl. Raya Cikembang No. 12, Sukabumi</td></tr>
                <tr><td>7.</td><td>Asal Sekolah</td><td>:</td><td>SD Buqatun Mubarakah</td></tr>
                <tr><td>8.</td><td>Jenjang Pilihan</td><td>:</td><td>MTs (Madrasah Tsanawiyah)</td></tr>
            </table>

            <div class="section-title">B. IDENTITAS ORANG TUA / WALI</div>
            <table class="form-table">
                <tr><td width="5%">1.</td><td width="35%">Nama Ayah</td><td width="2%">:</td><td>Ahmad</td></tr>
                <tr><td>2.</td><td>Nama Ibu</td><td>:</td><td>Fatimah</td></tr>
                <tr><td>3.</td><td>No. HP / WhatsApp</td><td>:</td><td>081234567890</td></tr>
                <tr><td>4.</td><td>Pekerjaan Orang Tua</td><td>:</td><td>Wiraswasta</td></tr>
            </table>
            
            <p style="text-align: justify; font-size: 10pt; margin-top: 20px;">
                <em>Dengan ini saya menyatakan bahwa data yang diisikan adalah benar. Saya selaku orang tua/wali dan calon santri bersedia mengikuti seluruh peraturan yang berlaku di Pondok Pesantren Al-Imam Al-Islam.</em>
            </p>

            <table class="ttd-table">
                <tr>
                    <td>Calon Santri,</td>
                    <td>Orang Tua / Wali,</td>
                </tr>
                <tr>
                    <td>( ATQANUL UMMAH AHMAD )</td>
                    <td>( AHMAD )</td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>`;

// 2. SURAT KELULUSAN
const kelulusanHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Surat Kelulusan</title>
    <style>
        ${commonStyle}
        .nomor-surat { margin-bottom: 20px; }
        .nomor-surat table { width: 60%; }
        .nomor-surat td { padding: 2px 5px; vertical-align: top; }
        .content { text-align: justify; }
        .student-details { margin: 15px 0 15px 40px; }
        .student-details table { width: 90%; }
        .student-details td { padding: 3px 5px; }
        .bold-diterima { font-size: 14pt; font-weight: bold; text-align: center; margin: 20px 0; padding: 10px; border: 2px solid #000; display: block; }
        .signature-area { margin-top: 40px; display: flex; justify-content: flex-end; position: relative; }
        .sig-box { text-align: left; width: 45%; position: relative; }
        .sig-name { margin-top: 10px; font-weight: bold; text-decoration: underline; position: relative; z-index: 11; }
    </style>
</head>
<body>
    <div class="container">
        <div class="content-area">
            <div style="text-align: right; margin-bottom: 20px;">
                Sukabumi, 15 Juli 2026
            </div>

            <div class="nomor-surat">
                <table>
                    <tr><td width="25%">Nomor</td><td width="2%">:</td><td>045/PPDB-AIIS/VII/2026</td></tr>
                    <tr><td>Lampiran</td><td>:</td><td>-</td></tr>
                    <tr><td>Perihal</td><td>:</td><td><strong>Pengumuman Hasil Seleksi Santri Baru</strong></td></tr>
                </table>
            </div>

            <div class="content">
                <p>Kepada Yth.,<br>Bapak/Ibu Orang Tua Wali dari Ananda <strong>ATQANUL UMMAH AHMAD</strong><br>di Tempat</p>
                
                <p><em>Assalamu'alaikum Warahmatullahi Wabarakatuh,</em></p>
                
                <p>Segala puji bagi Allah SWT Tuhan semesta alam. Shalawat serta salam senantiasa tercurahkan kepada teladan kita, Nabi Muhammad SAW.</p>

                <p>Berdasarkan hasil tes seleksi Penerimaan Peserta Didik Baru (PPDB) Pondok Pesantren Al-Imam Al-Islam Tahun Ajaran 2026/2027 yang telah diselenggarakan, kami Panitia PPDB memutuskan bahwa calon santri dengan identitas:</p>

                <div class="student-details">
                    <table>
                        <tr><td width="40%">Nomor Pendaftaran</td><td width="2%">:</td><td><strong>MTA2600001</strong></td></tr>
                        <tr><td>Nama Lengkap</td><td>:</td><td><strong>ATQANUL UMMAH AHMAD</strong></td></tr>
                        <tr><td>Jenjang / Program</td><td>:</td><td><strong>MTs (Madrasah Tsanawiyah)</strong></td></tr>
                        <tr><td>Asal Sekolah</td><td>:</td><td>SD Buqatun Mubarakah</td></tr>
                    </table>
                </div>

                <p>Dinyatakan:</p>

                <div class="bold-diterima">LULUS / DITERIMA</div>

                <p>Kami mengucapkan selamat bergabung dengan keluarga besar Pondok Pesantren Al-Imam Al-Islam. Langkah selanjutnya adalah menyelesaikan proses Daftar Ulang administrasi dan keuangan selambat-lambatnya tanggal 30 Juli 2026.</p>

                <p>Demikian surat keputusan ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan <em>Jazakumullahu Khairan Katsiran</em>.</p>
                
                <p><em>Wassalamu'alaikum Warahmatullahi Wabarakatuh.</em></p>
            </div>

            <div class="signature-area">
                <div class="sig-box">
                    <p>Ketua Panitia PPDB,</p>
                    <div class="ttd-space">
                        <img src="${stempelBase64}" class="stempel-img" alt="Stempel">
                        <img src="${ttdBase64}" class="ttd-img" alt="Tanda Tangan">
                    </div>
                    <div class="sig-name">Wahab Rajasam, M.Pd</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

// 3. LAPORAN DITERIMA
const laporanHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Penerimaan Santri Baru</title>
    <style>
        ${commonStyle}
        .judul { text-align: center; margin-bottom: 20px; }
        .judul h3 { margin: 0; font-size: 14pt; text-decoration: underline; font-weight: bold; }
        table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.data-table th, table.data-table td { border: 1px solid #000; padding: 8px; text-align: center; }
        table.data-table th { background-color: rgba(0,0,0,0.05); font-weight: bold; }
        .signature-area { margin-top: 40px; display: flex; justify-content: flex-end; position: relative; }
        .sig-box { text-align: left; width: 45%; position: relative; }
        .sig-name { margin-top: 10px; font-weight: bold; text-decoration: underline; position: relative; z-index: 11; }
    </style>
</head>
<body>
    <div class="container">
        <div class="content-area">
            <div class="judul">
                <h3>LAPORAN REKAPITULASI Penerimaan Peserta Didik Baru</h3>
                <p style="margin:0; font-weight:bold;">TAHUN AJARAN 2026/2027</p>
            </div>

            <p style="text-align: justify; margin-bottom: 15px;">
                Berdasarkan hasil seleksi Penerimaan Peserta Didik Baru (PPDB) Pondok Pesantren Al-Imam Al-Islam Tahun Ajaran 2026/2027 yang telah dilaksanakan pada tanggal 10 - 12 Juli 2026, bersama ini dilaporkan rekapitulasi jumlah calon santri yang dinyatakan <strong>DITERIMA</strong> dengan rincian sebagai berikut:
            </p>

            <table class="data-table">
                <thead>
                    <tr>
                        <th width="10%">No</th>
                        <th width="35%">Jenjang / Program</th>
                        <th width="20%">Jml Pendaftar</th>
                        <th width="20%">Jml Diterima</th>
                        <th width="15%">Ket</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td style="text-align: left;">MTs (Madrasah Tsanawiyah)</td>
                        <td>25</td>
                        <td><strong>19</strong> Santri</td>
                        <td>Laki-laki</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td style="text-align: left;">I'dad Lughowi (IL)</td>
                        <td>28</td>
                        <td><strong>22</strong> Santri</td>
                        <td>Laki-laki</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr style="font-weight: bold; background-color: rgba(0,0,0,0.02);">
                        <td colspan="2" style="text-align: right; padding-right:10px;">TOTAL KESELURUHAN</td>
                        <td>53</td>
                        <td>41 Santri</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>

            <p style="text-align: justify; margin-top: 15px;">
                Demikian laporan rekapitulasi penerimaan santri baru ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya. Daftar nama-nama santri yang diterima terlampir dalam Buku Ad-3 (Daftar Murid Baru).
            </p>

            <div class="signature-area">
                <div class="sig-box">
                    <p>Sukabumi, 15 Juli 2026<br>Ketua Panitia PPDB,</p>
                    <div class="ttd-space">
                        <img src="${stempelBase64}" class="stempel-img" alt="Stempel">
                        <img src="${ttdBase64}" class="ttd-img" alt="Tanda Tangan">
                    </div>
                    <div class="sig-name">Wahab Rajasam, M.Pd</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

const targetDir = path.join(__dirname, 'Berkas_Monev_PPDB_AlImam_2026');
fs.writeFileSync(path.join(targetDir, '3_Contoh_Formulir_Pendaftaran_Ad1.html'), ad1Html);
fs.writeFileSync(path.join(targetDir, '6_Contoh_Surat_Kelulusan_PPDB.html'), kelulusanHtml);
fs.writeFileSync(path.join(targetDir, '8_Laporan_Penerimaan_Santri_Baru_AlImam.html'), laporanHtml);

console.log('Berhasil memperbarui ketiga file dengan background A4!');
