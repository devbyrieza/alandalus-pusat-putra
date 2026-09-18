const sharp = require('sharp');

async function analyzeLogo() {
  try {
    const imagePath = 'C:/Users/itpua/.gemini/antigravity/brain/f8988091-9406-4d58-980e-1d62c2cca9b3/.user_uploaded/media_1789711390571.jpg';
    
    const image = sharp(imagePath);
    // Use larger resize to get more detail for thin text
    const smallBuffer = await image.clone().resize(400, 400).raw().toBuffer();
    
    const colors = {};
    for (let i = 0; i < smallBuffer.length; i += 3) { 
      const r = smallBuffer[i];
      const g = smallBuffer[i+1];
      const b = smallBuffer[i+2];
      
      // Look for pure Red (high R, low G and B)
      // Look for Yellow (high R, high G, low B)
      // Look for Green (low R, high G, low B)
      
      if (r > 150 && g < 50 && b < 50) { // RED
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        colors[hex] = (colors[hex] || 0) + 1;
      }
      else if (r > 200 && g > 200 && b < 100) { // YELLOW
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        colors[hex] = (colors[hex] || 0) + 1;
      }
    }

    console.log("Red Colors:");
    Object.entries(colors)
      .filter(([hex]) => parseInt(hex.substring(1,3), 16) > 150 && parseInt(hex.substring(3,5), 16) < 50)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([hex, count]) => console.log(hex, count));
      
    console.log("Yellow Colors:");
    Object.entries(colors)
      .filter(([hex]) => parseInt(hex.substring(1,3), 16) > 200 && parseInt(hex.substring(3,5), 16) > 200)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([hex, count]) => console.log(hex, count));

  } catch (e) {
    console.error(e);
  }
}

analyzeLogo();
