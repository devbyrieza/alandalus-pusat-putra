const sharp = require('sharp');
const path = require('path');

async function run() {
    const bgPath = path.join(__dirname, 'public/images/kop-surat-full.jpg');
    const image = sharp(bgPath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    
    // Scan y from 2600 to 3200, find number of dark pixels (R<200, G<200, B<200) in x=1000..2000
    console.log("Y-coord scanning for dark pixels:");
    for (let y = 2600; y < 3200; y += 10) {
        let darkCount = 0;
        for (let x = 1000; x < 2000; x++) {
            const idx = (y * info.width + x) * 3;
            const r = data[idx];
            const g = data[idx+1];
            const b = data[idx+2];
            if (r < 200 && g < 200 && b < 200) {
                darkCount++;
            }
        }
        if (darkCount > 20) {
            console.log(`y=${y}: dark pixels=${darkCount}`);
        }
    }
}

run().catch(console.error);
