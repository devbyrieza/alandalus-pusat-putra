const sharp = require('sharp');
const path = require('path');

async function run() {
    const bgPath = path.join(__dirname, 'public/images/kop-surat-full.jpg');
    const image = sharp(bgPath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    
    let minX = info.width, maxX = 0;
    for (let y = 2880; y < 2990; y++) {
        for (let x = 0; x < info.width; x++) {
            const idx = (y * info.width + x) * 3;
            const r = data[idx];
            const g = data[idx+1];
            const b = data[idx+2];
            // If it's dark
            if (r < 200 && g < 200 && b < 200) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
            }
        }
    }
    console.log(`X-bounds for text: minX=${minX}, maxX=${maxX}`);
}

run().catch(console.error);
