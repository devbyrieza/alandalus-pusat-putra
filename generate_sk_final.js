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

// Gunakan kop-surat-full.jpg yang sudah ada (ini pasti A4 yang bagus)
const bgPath = path.join(__dirname, 'public/images/kop-surat-clean.jpg'); 
const ttdPath = path.join(__dirname, 'public/images/ttd-mudir.png');
const stempelPath = path.join(__dirname, 'public/documents/Stempel 5.png'); // Gunakan logo resmi sebagai stempel digital

const bgBase64 = getBase64(bgPath);
const ttdBase64 = getBase64(ttdPath);
const stempelBase64 = getBase64(stempelPath);

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>SK Panitia PPDB Al-Imam (Final)</title>
    <style>
        body { 
            font-family: 'Times New Roman', Times, serif; 
            margin: 0; 
            padding: 20px; 
            font-size: 11pt; 
            line-height: 1.25; 
            background: #e0e0e0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .container { 
            width: 794px; /* A4 Width (96dpi) */
            height: 1123px; /* A4 Height fixed to prevent stretching */
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
            padding: 265px 80px 30px 80px; /* Leave enough for Kop at top */
            position: relative;
            z-index: 2;
        }
        .judul { text-align: center; margin-bottom: 10px; }
        .judul h3 { margin: 0; font-size: 14pt; text-decoration: underline; font-weight: bold; }
        .judul p { margin: 2px 0 0 0; }
        .isi { text-align: justify; }
        .menimbang, .mengingat, .memutuskan { margin-bottom: 5px; }
        .memutuskan { text-align: center; font-weight: bold; margin: 10px 0; font-size: 14pt; letter-spacing: 2px; }
        table.list { width: 100%; border-collapse: collapse; margin-top: 5px; }
        table.list td { vertical-align: top; padding: 2px 0; text-align: justify;}
        
        .ttd-area { margin-top: 10px; display: flex; justify-content: flex-end; position: relative; }
        .ttd-box { text-align: left; width: 55%; position: relative; }
        
        .ttd-space {
            position: relative;
            height: 80px;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .ttd-img {
            position: absolute;
            top: 5px;
            left: 25px;
            width: 140px;
            z-index: 10;
            mix-blend-mode: multiply;
        }
        .stempel-img {
            position: absolute;
            top: -20px;
            left: -45px;
            width: 110px;
            z-index: 9;
            opacity: 0.85; /* Make logo slightly transparent to look like a stamp */
            mix-blend-mode: multiply;
        }
        .sig-name { margin-top: 10px; font-weight: bold; text-decoration: underline; position: relative; z-index: 11; }
        
        @media print { 
            body { padding: 0; background: #fff; } 
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content-area">
            <div class="judul">
                <h3>SURAT KEPUTUSAN MUDIR PONDOK PESANTREN</h3>
                <p>Nomor: 012/SK/PPDB-AIIS/I/2026</p>
                <p>Tentang</p>
                <p><strong>PEMBENTUKAN PANITIA Penerimaan Peserta Didik Baru (PPDB)<br>TAHUN AJARAN 2026/2027</strong></p>
            </div>

            <div class="isi">
                <div class="menimbang">
                    <table class="list">
                        <tr><td width="15%"><strong>Menimbang</strong></td><td width="3%">:</td>
                            <td>a. Bahwa untuk kelancaran pelaksanaan Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 perlu dibentuk susunan kepanitiaan.<br>
                                b. Bahwa nama-nama yang tercantum dalam lampiran surat keputusan ini dipandang mampu dan cakap untuk melaksanakan tugas tersebut.</td>
                        </tr>
                    </table>
                </div>

                <div class="mengingat">
                    <table class="list">
                        <tr><td width="15%"><strong>Mengingat</strong></td><td width="3%">:</td>
                            <td>1. Undang-Undang No. 20 Tahun 2003 tentang Sistem Pendidikan Nasional.<br>
                                2. Program Kerja Pondok Pesantren Al-Imam Al-Islam Tahun 2026.</td>
                        </tr>
                    </table>
                </div>

                <div class="memutuskan">MEMUTUSKAN</div>

                <div class="menetapkan">
                    <table class="list">
                        <tr><td width="15%"><strong>Menetapkan</strong></td><td width="3%">:</td><td></td></tr>
                        <tr><td>Pertama</td><td>:</td><td>Membentuk Panitia Penerimaan Peserta Didik Baru (PPDB) Pondok Pesantren Al-Imam Al-Islam Tahun Ajaran 2026/2027 dengan susunan panitia sebagai berikut:
                            <br><br>
                            <table>
                                <tr><td width="42%">Penanggung Jawab / Ketua PPDB</td><td width="5%">:</td><td>Wahab Rajasam, M.Pd (Mudir Pesantren)</td></tr>
                                <tr><td>Sekretaris / Admin Utama</td><td>:</td><td>Rieza Eka Tomara, S.Kom</td></tr>
                                <tr><td>Admin Keuangan</td><td>:</td><td>Maulidin Bachtiar, A.Md.Kom</td></tr>
                                <tr><td>Penguji Al-Quran</td><td>:</td><td>Agus Cahyono</td></tr>
                                <tr><td>Pewawancara Orang Tua</td><td>:</td><td>Maulidin Bachtiar, A.Md.Kom</td></tr>
                                <tr><td>Pewawancara Santri</td><td>:</td><td>Rieza Eka Tomara, S.Kom</td></tr>
                            </table>
                        </td></tr>
                        <tr><td>Kedua</td><td>:</td><td>Panitia bertugas menyelenggarakan seluruh rangkaian kegiatan PPDB mulai dari sosialisasi, pendaftaran, seleksi, hingga daftar ulang administrasi sesuai dengan ketentuan yang berlaku.</td></tr>
                        <tr><td>Ketiga</td><td>:</td><td>Segala biaya yang timbul akibat diterbitkannya Surat Keputusan ini dibebankan pada anggaran pondok pesantren.</td></tr>
                        <tr><td>Keempat</td><td>:</td><td>Keputusan ini berlaku sejak tanggal ditetapkan dan apabila di kemudian hari terdapat kekeliruan akan diperbaiki sebagaimana mestinya.</td></tr>
                    </table>
                </div>
            </div>

            <div class="ttd-area">
                <div class="ttd-box">
                    <p>Ditetapkan di : Sukabumi<br>Pada Tanggal : 02 Januari 2026</p>
                    <p>Mudir Pondok Pesantren,<br>
                    <strong>Yayasan Pesantren Tahfiz Al-Qur'an Al-Imam</strong><br>
                    <span style="font-size: 9pt; font-weight: normal; line-height: 1.1; display: inline-block; margin-top: 2px;">SK Kemenkumham : AHU-AH.01.06-0010507<br>
                    Tanggal SK Kemenkumham : 11 Februari 2021</span></p>
                    
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

fs.writeFileSync(path.join(__dirname, 'Berkas_Monev_PPDB_AlImam_2026', '1_SK_Panitia_PPDB.html'), htmlContent);
console.log('Berhasil perbaiki file!');
