const fs = require('fs');
const path = require('path');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>SK Panitia PMB (Draft)</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 20px; font-size: 12pt; line-height: 1.5; }
        .container { max-width: 800px; margin: 0 auto; padding: 40px; background: #fff; }
        .kop-surat { text-align: center; border-bottom: 3px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .kop-surat h2 { margin: 0; font-size: 16pt; font-weight: bold; }
        .kop-surat h3 { margin: 5px 0; font-size: 14pt; }
        .kop-surat p { margin: 0; font-size: 10pt; }
        .judul { text-align: center; margin-bottom: 30px; }
        .judul h3 { margin: 0; font-size: 14pt; text-decoration: underline; font-weight: bold; }
        .judul p { margin: 5px 0 0 0; }
        .isi { text-align: justify; }
        .menimbang, .mengingat, .memutuskan { margin-bottom: 15px; }
        .memutuskan { text-align: center; font-weight: bold; margin: 30px 0; font-size: 14pt; }
        table.list { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table.list td { vertical-align: top; padding: 3px 0; }
        .ttd-area { margin-top: 50px; display: flex; justify-content: flex-end; }
        .ttd-box { text-align: left; width: 45%; }
        .sig-name { margin-top: 70px; font-weight: bold; text-decoration: underline; }
        @media print { body { padding: 0; } .container { padding: 0; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="kop-surat">
            <h2>YAYASAN AL ANDALUS AL IMAM</h2>
            <h3>PONDOK PESANTREN AL-IMAM AL-ISLAM</h3>
            <p>NSPP: 510032020117 | SK KEMENKUMHAM: AHU-0010834.AH.01.04.Tahun 2021</p>
            <p>Jl. Cikembang, RT. 02/05, Desa Cimanggu, Kec. Cikembar, Kab. Sukabumi, Jawa Barat</p>
        </div>

        <div class="judul">
            <h3>SURAT KEPUTUSAN KEPALA MADRASAH</h3>
            <p>Nomor: 012/SK/PMB-AIIS/I/2026</p>
            <p>Tentang</p>
            <p><strong>PEMBENTUKAN PANITIA PENERIMAAN MURID BARU (PMB)<br>TAHUN AJARAN 2026/2027</strong></p>
        </div>

        <div class="isi">
            <div class="menimbang">
                <table class="list">
                    <tr><td width="15%"><strong>Menimbang</strong></td><td width="3%">:</td>
                        <td>a. Bahwa untuk kelancaran pelaksanaan Penerimaan Murid Baru (PMB) Tahun Ajaran 2026/2027 perlu dibentuk susunan panitia.<br>
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
                    <tr><td>Pertama</td><td>:</td><td>Membentuk Panitia Penerimaan Murid Baru (PMB) Pondok Pesantren Al-Imam Al-Islam Tahun Ajaran 2026/2027 dengan susunan panitia sebagai berikut:
                        <br><br>
                        Penanggung Jawab : Retna Ningsih, S.Pd (Kepala Madrasah)<br>
                        Ketua Panitia &nbsp;&nbsp;&nbsp;&nbsp;: Ustadz Rieza<br>
                        Sekretaris &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: (Nama Staf)<br>
                        Bendahara &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: (Nama Bendahara)<br>
                        Seksi Kesantrian : (Nama Kesantrian)
                    </td></tr>
                    <tr><td>Kedua</td><td>:</td><td>Panitia bertugas menyelenggarakan seluruh rangkaian kegiatan PMB mulai dari pendaftaran, seleksi, hingga daftar ulang sesuai dengan ketentuan yang berlaku.</td></tr>
                    <tr><td>Ketiga</td><td>:</td><td>Segala biaya yang timbul akibat diterbitkannya Surat Keputusan ini dibebankan pada anggaran pondok pesantren.</td></tr>
                    <tr><td>Keempat</td><td>:</td><td>Keputusan ini berlaku sejak tanggal ditetapkan dan apabila di kemudian hari terdapat kekeliruan akan diperbaiki sebagaimana mestinya.</td></tr>
                </table>
            </div>
        </div>

        <div class="ttd-area">
            <div class="ttd-box">
                <p>Ditetapkan di : Sukabumi<br>Pada Tanggal : 02 Januari 2026</p>
                <p>Kepala Madrasah,</p>
                <div class="sig-name">Retna Ningsih, S.Pd</div>
                <p style="margin: 0;">NUPTK. 1234567890</p>
            </div>
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'Berkas_Monev_PMB_AlImam_2026', '1_Draft_SK_Panitia_PMB.html'), htmlContent);
console.log('Berhasil membuat 1_Draft_SK_Panitia_PMB.html');
