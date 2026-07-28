const fs = require('fs');
const path = require('path');
const pdf2img = require('pdf-img-convert');

const pdfPath = path.join(__dirname, 'public', 'documents', 'CETAK KOP SURAT VERSI 1 DAN 2.pdf');
const outDir = path.join(__dirname, 'public', 'documents');

async function main() {
  try {
    console.log('Starting conversion of PDF...');
    const images = await pdf2img.convert(pdfPath, {
      width: 1200 // Set high width for crisp text
    });
    
    console.log(`Successfully converted. Total pages: ${images.length}`);
    for (let i = 0; i < images.length; i++) {
      const outPath = path.join(outDir, `kop_versi_${i + 1}.png`);
      fs.writeFileSync(outPath, images[i]);
      console.log(`Saved: ${outPath}`);
    }
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

main();
