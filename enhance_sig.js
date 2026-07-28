const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function run() {
    const ttdPath = path.join(__dirname, 'public/images/ttd-mudir.png');
    const backupPath = path.join(__dirname, 'public/images/ttd-mudir-original.png');
    
    if (!fs.existsSync(ttdPath)) {
        console.error("Signature file not found.");
        return;
    }
    
    // Backup original signature
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(ttdPath, backupPath);
        console.log("Original signature backed up.");
    }
    
    const image = sharp(backupPath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    
    // Modify pixels to make signature line pure black and opaque
    const outBuffer = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i += info.channels) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const a = info.channels === 4 ? data[i+3] : 255;
        
        // Calculate average brightness
        const brightness = (r + g + b) / 3;
        
        // If it's a dark line pixel
        if (brightness < 210 && a > 20) {
            outBuffer[i] = 0;     // Pure Black R
            outBuffer[i+1] = 0;   // Pure Black G
            outBuffer[i+2] = 0;   // Pure Black B
            outBuffer[i+3] = 255; // Opaque
        } else {
            // transparent background
            outBuffer[i] = 255;
            outBuffer[i+1] = 255;
            outBuffer[i+2] = 255;
            outBuffer[i+3] = 0;
        }
    }
    
    await sharp(outBuffer, {
        raw: {
            width: info.width,
            height: info.height,
            channels: info.channels
        }
    }).png().toFile(ttdPath);
    
    console.log("Successfully enhanced signature contrast!");
}

run().catch(console.error);
