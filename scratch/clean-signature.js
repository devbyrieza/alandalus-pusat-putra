const sharp = require('sharp');
const fs = require('fs');

async function cleanSignature() {
  const imgPath = 'c:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/public/images/ttd-mudir.png';
  const img = sharp(imgPath);
  const metadata = await img.metadata();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  
  const width = info.width;
  const height = info.height;
  
  // Hapus semua piksel di sebelah kiri (x = 0 s.d x = 75) untuk membersihkan box stempel hitam bawaan
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < 75; x++) {
      const idx = (y * width + x) * 4;
      data[idx] = 0;
      data[idx+1] = 0;
      data[idx+2] = 0;
      data[idx+3] = 0; // Transparan
    }
  }
  
  // Tulis kembali ke ttd-mudir.png
  await sharp(data, {
    raw: {
      width: width,
      height: height,
      channels: 4
    }
  }).png().toFile(imgPath);
  console.log('Tanda tangan berhasil dibersihkan dari box stempel hitam!');
}

cleanSignature().catch(console.error);
