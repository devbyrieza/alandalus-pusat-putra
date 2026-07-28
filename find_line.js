const sharp = require('sharp');
const path = require('path');

async function run() {
    const bgPath = path.join(__dirname, 'public/images/kop-surat-full.jpg');
    const image = sharp(bgPath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    
    // Find x between 1800 and 1950 that has a high concentration of dark pixels from y=2880 to 2980
    console.log("Scanning for vertical line:");
    let lineX = 0;
    for (let x = 1800; x < 1950; x++) {
        let darkCount = 0;
        for (let y = 2880; y < 2980; y++) {
            const idx = (y * info.width + x) * 3;
            if (data[idx] < 200 && data[idx+1] < 200 && data[idx+2] < 200) {
                darkCount++;
            }
        }
        // If it's a solid line, it should have a very high dark pixel count
        if (darkCount > 80) {
            console.log(`x=${x}: dark pixels=${darkCount}`);
            lineX = x;
            break;
        }
    }
    console.log(`Vertical line is at x = ${lineX}`);
}

run().catch(console.error);
