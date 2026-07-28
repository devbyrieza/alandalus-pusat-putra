const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const inputPath = 'C:\\Users\\itpua\\.gemini\\antigravity\\brain\\654479ca-1a6f-42b3-986b-20da51b3b963\\media__1783251656833.jpg';
    const outputPath = path.join(__dirname, 'public/images/ttd-muhlis.png');

    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input image not found at ${inputPath}`);
    }

    const img = sharp(inputPath);
    const metadata = await img.metadata();
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;
    const channels = info.channels; // should be 4 since we ran ensureAlpha()

    console.log(`Processing image: ${width}x${height}, channels: ${channels}`);

    const outputData = Buffer.alloc(width * height * 4);

    // We want to detect the signature lines (which are darker than the paper background)
    // Let's analyze brightness.
    // Paper is off-white (high R, G, B around 200-240).
    // Signature ink is dark gray/black (low R, G, B around 50-120).
    
    // We'll threshold at around 160.
    // If average brightness < 160, it's ink.
    // To make it look smooth and sharp, we scale opacity.
    const threshold = 175;
    
    for (let i = 0; i < width * height; i++) {
      const idx = i * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      const brightness = (r + g + b) / 3;
      
      const outIdx = i * 4;
      if (brightness < threshold) {
        // Ink pixel: Make it pure black, but scale the alpha based on how dark it is
        // Darker ink = more opaque.
        const diff = threshold - brightness;
        // Scale factor: diff of 70 or more = 100% opaque
        const alpha = Math.min(255, Math.round((diff / 70) * 255));
        
        outputData[outIdx] = 0;     // R
        outputData[outIdx + 1] = 0; // G
        outputData[outIdx + 2] = 0; // B
        outputData[outIdx + 3] = alpha; // A
      } else {
        // Background pixel: make it transparent
        outputData[outIdx] = 0;
        outputData[outIdx + 1] = 0;
        outputData[outIdx + 2] = 0;
        outputData[outIdx + 3] = 0;
      }
    }

    await sharp(outputData, {
      raw: {
        width: width,
        height: height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);

    console.log(`Polished signature saved to ${outputPath}`);
  } catch (error) {
    console.error('Error polishing signature:', error);
  }
}

main();
