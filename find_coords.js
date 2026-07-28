const sharp = require('sharp');
const path = require('path');

async function run() {
    const bgPath = path.join(__dirname, 'public/images/kop-surat-full.jpg');
    const image = sharp(bgPath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    
    // Width is info.width (2261), Height is info.height (3200)
    // We want to inspect the region: left=800 to 2000, top=2000 to 3200
    // Let's find where the red footer starts.
    // The red footer has a distinct red color. Let's find pixels with R > 150, G < 50, B < 50.
    let redBarTop = info.height;
    for (let y = 2000; y < info.height; y++) {
        for (let x = 0; x < info.width; x++) {
            const idx = (y * info.width + x) * 3;
            const r = data[idx];
            const g = data[idx+1];
            const b = data[idx+2];
            if (r > 130 && g < 60 && b < 60) {
                if (y < redBarTop) {
                    redBarTop = y;
                    break;
                }
            }
        }
        if (redBarTop < info.height) break;
    }
    console.log(`Red bar starts at y = ${redBarTop}`);

    // Now let's find the bounding box of the black/grey text in the region:
    // x = 800 to 1900, y = 2000 to redBarTop - 10
    // The text pixels are dark (R < 150, G < 150, B < 150, and not white).
    let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
    for (let y = 2000; y < redBarTop - 10; y++) {
        for (let x = 800; x < 1900; x++) {
            const idx = (y * info.width + x) * 3;
            const r = data[idx];
            const g = data[idx+1];
            const b = data[idx+2];
            // If it's not white (any channel < 240) and it's dark
            if (r < 180 && g < 180 && b < 180) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }
    
    console.log(`Text Bounding Box: left=${minX}, top=${minY}, right=${maxX}, bottom=${maxY}`);
    console.log(`Suggested Rect: left=${minX - 10}, top=${minY - 10}, width=${maxX - minX + 20}, height=${maxY - minY + 20}`);
}

run().catch(console.error);
