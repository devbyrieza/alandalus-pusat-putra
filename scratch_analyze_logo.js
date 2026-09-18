const sharp = require('sharp');

async function analyzeLogo() {
  try {
    const imagePath = 'C:/Users/itpua/.gemini/antigravity/brain/f8988091-9406-4d58-980e-1d62c2cca9b3/.user_uploaded/media_1789711390571.jpg';
    
    // Read the image
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    console.log(`Image Size: ${metadata.width}x${metadata.height}`);

    // Extract specific pixels (x, y)
    // Top-left for background
    // Center for yellow
    // Bottom for red text
    
    // Background: Let's crop a 10x10 region at (10, 10) and get average
    const bgBuffer = await image.clone().extract({ left: 10, top: 10, width: 10, height: 10 }).raw().toBuffer();
    
    // Yellow calligraphy: Let's crop somewhere near center. Wait, a safer way is to use k-means or just scan all pixels.
    // Let's get raw pixel data for a resized 100x100 version of the image to find the distinct colors
    
    const smallBuffer = await image.clone().resize(100, 100).raw().toBuffer();
    
    const colors = {};
    for (let i = 0; i < smallBuffer.length; i += 3) { // Assuming 3 channels RGB
      const r = smallBuffer[i];
      const g = smallBuffer[i+1];
      const b = smallBuffer[i+2];
      // Quantize slightly to group similar colors
      const qr = Math.round(r / 10) * 10;
      const qg = Math.round(g / 10) * 10;
      const qb = Math.round(b / 10) * 10;
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      const qhex = `#${qr.toString(16).padStart(2, '0')}${qg.toString(16).padStart(2, '0')}${qb.toString(16).padStart(2, '0')}`;
      
      if (!colors[qhex]) {
        colors[qhex] = { count: 0, sample: hex, r, g, b };
      }
      colors[qhex].count++;
    }

    const sortedColors = Object.values(colors).sort((a, b) => b.count - a.count);
    
    console.log("Dominant Colors found:");
    sortedColors.slice(0, 10).forEach(c => {
      console.log(`Hex: ${c.sample.toUpperCase()} (R:${c.r} G:${c.g} B:${c.b}) - Area: ${c.count} pixels`);
    });

  } catch (e) {
    console.error(e);
  }
}

analyzeLogo();
