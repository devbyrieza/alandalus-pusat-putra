const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '01_Template_Kartu_AlImam.html');
if (!fs.existsSync(srcPath)) {
    console.error('File not found:', srcPath);
    process.exit(1);
}

let srcHtml = fs.readFileSync(srcPath, 'utf8');

const styleMatch = srcHtml.match(/<style>([\s\S]*?)<\/style>/);
const styles = styleMatch ? styleMatch[1] : '';

const frontMatch = srcHtml.match(/(<div class=\"id-card\">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/);
let frontCardHtml = frontMatch ? frontMatch[1] : '';

// The back card is the second `.id-card`
const allCards = srcHtml.match(/<div class=\"id-card\">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g);
let backCardHtml = allCards && allCards.length > 1 ? allCards[1] : '';

const createPage = (content, title) => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800;900&display=swap" rel="stylesheet">
    <style>${styles} 
    @page { size: 260px 410px; margin: 0; }
    body { margin: 0; padding: 0; width: 260px; height: 410px; overflow: hidden; background: #fff; }
    .id-card { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
    </style>
</head>
<body>
${content}
</body>
</html>`;

// Write Mockup Depan
fs.writeFileSync('MOCKUP_DEPAN.html', createPage(frontCardHtml, 'Mockup Depan'));

// Write Mockup Belakang
fs.writeFileSync('MOCKUP_BELAKANG.html', createPage(backCardHtml, 'Mockup Belakang'));

// Create Master Depan by removing dynamic info
let masterFront = frontCardHtml;
masterFront = masterFront.replace(/<img[^>]*alt="Foto Santri"[^>]*>/g, '<div style="width: 130px; height: 160px; border-radius: 10px; background: #e0e0e0; display: flex; align-items: center; justify-content: center; color: #888; font-size: 10px; font-weight: bold; border: 2px dashed #999;">FOTO SANTRI</div>');
masterFront = masterFront.replace(/<h2>.*?<\/h2>/g, '<h2>[NAMA SANTRI]</h2>');
masterFront = masterFront.replace(/<p>No Induk:.*?<\/p>/g, '<p>No Induk: [XXXXXXXXXX]</p>');
masterFront = masterFront.replace(/<img[^>]*alt="QR Code"[^>]*>/g, '<div style="width: 100%; height: 100%; background: #e0e0e0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #888; font-weight: bold; border: 2px dashed #999;">QR CODE</div>');

fs.writeFileSync('MASTER_DEPAN.html', createPage(masterFront, 'Master Depan'));

// Master Belakang is same as Mockup since no dynamic data
fs.writeFileSync('MASTER_BELAKANG.html', createPage(backCardHtml, 'Master Belakang'));

console.log('Files generated: MOCKUP_DEPAN.html, MOCKUP_BELAKANG.html, MASTER_DEPAN.html, MASTER_BELAKANG.html');
