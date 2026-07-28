const fs = require('fs');
const sizeOf = require('image-size');
const path = require('path');

const files = [
    'bg_extracted.jpg',
    'public/images/kop_header_alimam.jpg',
    'public/images/stempel-pesantren.png',
    'public/images/logo.png',
    'public/images/kop-surat-full.jpg'
];

files.forEach(f => {
    const p = path.join(__dirname, f);
    if(fs.existsSync(p)) {
        const dim = sizeOf(p);
        console.log(`${f}: ${dim.width}x${dim.height} (${dim.type})`);
    } else {
        console.log(`${f} not found.`);
    }
});
