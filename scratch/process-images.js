const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processImage() {
  const artifactDir = 'C:/Users/itpua/.gemini/antigravity/brain/cee04ba8-c9fd-44ea-a1e1-7f24847d0e5d';
  
  // 1. Process Signature (image1.png) -> ttd-mudir.png
  console.log('Processing signature...');
  const sigPath = path.join(artifactDir, 'image1.png');
  const sig = sharp(sigPath);
  const sigMetadata = await sig.metadata();
  const sigBuffer = await sig.ensureAlpha().raw().toBuffer();
  
  // Make white transparent, and other pixels dark blue/black ink
  for (let i = 0; i < sigBuffer.length; i += 4) {
    const r = sigBuffer[i];
    const g = sigBuffer[i+1];
    const b = sigBuffer[i+2];
    const a = sigBuffer[i+3];
    
    if (a < 10) {
      continue; // Keep existing transparent pixels
    }
    
    // Average of RGB channels to detect brightness
    const brightness = (r + g + b) / 3;
    if (brightness > 220) {
      sigBuffer[i+3] = 0; // Make white transparent
    } else {
      // Colorize signature with dark blue/black pen ink (RGB 15, 25, 60)
      sigBuffer[i] = 15;
      sigBuffer[i+1] = 25;
      sigBuffer[i+2] = 60;
      // Make the ink solid
      sigBuffer[i+3] = Math.min(255, (255 - brightness) * 1.8);
    }
  }
  
  const destSigPath = 'c:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/public/images/ttd-mudir.png';
  await sharp(sigBuffer, {
    raw: {
      width: sigMetadata.width,
      height: sigMetadata.height,
      channels: 4
    }
  }).png().toFile(destSigPath);
  console.log('Saved transparent signature to:', destSigPath);
  
  // 2. Process Stamp (image2.png) -> stempel-pesantren.png
  console.log('Processing stamp...');
  const stampPath = path.join(artifactDir, 'image2.png');
  const stamp = sharp(stampPath);
  const stampMetadata = await stamp.metadata();
  const stampBuffer = await stamp.ensureAlpha().raw().toBuffer();
  
  for (let i = 0; i < stampBuffer.length; i += 4) {
    const r = stampBuffer[i];
    const g = stampBuffer[i+1];
    const b = stampBuffer[i+2];
    const a = stampBuffer[i+3];
    
    // Jika piksel memang sudah transparan sejak awal, biarkan transparan!
    if (a < 10) {
      continue;
    }
    
    const brightness = (r + g + b) / 3;
    if (brightness > 220) {
      stampBuffer[i+3] = 0; // Jika ada piksel putih, buat transparan
    } else {
      // Warnai stempel dengan warna Hijau Resmi: rgb(0, 102, 51)
      stampBuffer[i] = 0;
      stampBuffer[i+1] = 102;
      stampBuffer[i+2] = 51;
      // Pertahankan tingkat kepekatan/alpha asli stempel
      stampBuffer[i+3] = a;
    }
  }
  
  const destStampPath = 'c:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/public/images/stempel-pesantren.png';
  await sharp(stampBuffer, {
    raw: {
      width: stampMetadata.width,
      height: stampMetadata.height,
      channels: 4
    }
  }).png().toFile(destStampPath);
  console.log('Saved transparent stamp to:', destStampPath);
  
  console.log('Image processing completed successfully!');
}

processImage().catch(console.error);
