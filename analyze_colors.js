const sharp = require('sharp');
const path = require('path');

async function analyze(file) {
    const { data, info } = await sharp(path.join(__dirname, 'public/images/debug', file)).raw().toBuffer({ resolveWithObject: true });
    let black = 0;
    let green = 0;
    let white = 0;
    for (let i = 0; i < data.length; i += info.channels) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        if (r > 240 && g > 240 && b > 240) {
            white++;
        } else if (g > r + 10 && g > b + 10) {
            green++;
        } else if (r < 150 && g < 150 && b < 150) {
            black++;
        }
    }
    console.log(`${file}: Black: ${black}, Green: ${green}, White: ${white}`);
}

async function main() {
    await analyze('img_22_320x220.png');
    await analyze('img_23_320x220.png');
}
main().catch(console.error);
