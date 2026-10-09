const fs = require('fs');
const file = "c:/Users/itpua/Dev/Work/al-andalus/andalus-pusat-putra/src/lib/whatsapp-queue.ts";
let content = fs.readFileSync(file, 'utf8');

const regex = /if \(status === "Diterima" \|\| status === "accepted"\) \{[\s\S]*?return `[\s\S]*?`;\n    \}/;

const newWa = `if (status === "Diterima" || status === "accepted") {
        return \`*PENGUMUMAN KELULUSAN SELEKSI*

*Bismillāhirraḥmānirraḥīm*

Assalāmu‘alaikum warahmatullāhi wabarakātuh.

Alhamdulillāh, berdasarkan hasil seleksi Penerimaan Santri Baru (PSB), dengan ini kami sampaikan bahwa:

*Nama:* \${nama}
*Jenjang:* \${jenjang}
*Nomor Tes:* *\${nomor_tes}*

*DINYATAKAN LULUS SELEKSI*

*Māsyā Allāh, tabārakallāh.*

Selamat kepada Ananda *\${nama}* dan Abu serta Ummu. Semoga Allah ﷻ memberikan keberkahan dan kemudahan kepada Ananda dalam melanjutkan pendidikan di *\${BRANDING.schoolName}*.

*TAHAP SELANJUTNYA – DAFTAR ULANG*

Abu dan Ummu dapat melanjutkan proses *daftar ulang melalui Virtual Account (VA) yang telah terlampir* pada surat pengumuman kelulusan.

Setelah melakukan pembayaran, mohon:

1. Melakukan pembayaran daftar ulang melalui *VA yang terlampir*.
2. Menyimpan *bukti transfer/pembayaran*.
3. Mengirimkan *bukti pembayaran* kepada bagian *PPDB/Humas* sebagai konfirmasi daftar ulang.

*INFORMASI & KONFIRMASI*

*Humas:* 0811 2802 1035
*PSB/PPDB:* 0851 7527 5085

Mohon bukti pembayaran dikirimkan kepada salah satu nomor di atas dengan jelas agar dapat segera dilakukan proses konfirmasi daftar ulang.

Jazakumullāhu khairan atas kepercayaan Abu dan Ummu kepada *\${BRANDING.schoolName}*.

Semoga Allah ﷻ menjadikan Ananda santri yang *shaleh, berilmu, berakhlak mulia, mandiri, dan bermanfaat bagi agama, keluarga, dan umat.*

Wassalāmu‘alaikum warahmatullāhi wabarakātuh.

*Panitia PSB/PPDB*
*\${BRANDING.schoolName}*\`;
    }`;

content = content.replace(regex, newWa);
fs.writeFileSync(file, content);
console.log('WA Putra updated');
