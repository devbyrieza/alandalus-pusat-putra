const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'Bahan_ID_Card_AlImam/01_Template_Kartu_AlImam.html');
let html = fs.readFileSync(htmlPath, 'utf8');

function encodeBase64(filePath, mimeType) {
    try {
        const data = fs.readFileSync(filePath);
        return `data:${mimeType};base64,${data.toString('base64')}`;
    } catch (e) {
        console.error("Error reading " + filePath, e);
        return '';
    }
}

// 1. Al Imam Logo
const logo1 = encodeBase64(path.join(__dirname, 'public/images/logo.png'), 'image/png');
if(logo1) html = html.replace(/src="public\/images\/logo\.png"/g, `src="${logo1}"`);

// 2. Andalus Logo
const logo2 = encodeBase64(path.join(__dirname, 'public/images/logo-andalus.png'), 'image/png');
if(logo2) html = html.replace(/src="public\/images\/logo-andalus\.png"/g, `src="${logo2}"`);

// 3. Ustadz Agus Cahyono
const fotoPanitia = encodeBase64(path.join(__dirname, 'public/panitia/ustadz-agus-cahyono.png'), 'image/png');
if(fotoPanitia) html = html.replace(/src="public\/panitia\/ustadz-agus-cahyono\.png"/g, `src="${fotoPanitia}"`);

// 4. Abdul Aziz Ali
const fotoSantri = encodeBase64(path.join(__dirname, '../safina-keuangan/public/images/foto-kartu-jajan/abdul-aziz-ali.jpg'), 'image/jpeg');
if(fotoSantri) html = html.replace(/src="\.\.\/safina-keuangan\/public\/images\/foto-kartu-jajan\/abdul-aziz-ali\.jpg"/g, `src="${fotoSantri}"`);

fs.writeFileSync(path.join(__dirname, 'Preview_Mudir_Siap_Kirim.html'), html);
console.log('Done creating standalone HTML');
