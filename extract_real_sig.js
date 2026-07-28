const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function extractSig() {
    const rawData = fs.readFileSync('public/images/debug/img_22_320x220.dat');
    // img_22 has length 211200. 320 * 220 = 70400. 211200 / 70400 = 3 channels (RGB)
    const { data } = await sharp(rawData, { raw: { width: 320, height: 220, channels: 3 } }).raw().toBuffer({ resolveWithObject: true });
    
    // Convert white background to transparent
    const outData = Buffer.alloc(320 * 220 * 4);
    for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        outData[j] = r;
        outData[j+1] = g;
        outData[j+2] = b;
        
        // If it's close to white, make it transparent
        if (r > 200 && g > 200 && b > 200) {
            outData[j+3] = 0; // Transparent
        } else {
            outData[j+3] = 255; // Opaque
        }
    }
    
    await sharp(outData, { raw: { width: 320, height: 220, channels: 4 } }).png().toFile('public/images/real_sig_transparent.png');
    console.log("Saved real_sig_transparent.png");
}

extractSig().catch(console.error);
