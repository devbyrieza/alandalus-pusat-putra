const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const zlib = require('zlib');
const sharp = require('sharp');

async function extractAll() {
  const filePath = path.resolve(__dirname, 'public/documents/Surat Pemberitahuan Kedatangan Santri Baru 2026-2027.pdf');
  const fileBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(fileBytes);
  
  const context = pdfDoc.context;
  const objects = context.enumerateIndirectObjects();
  
  let i = 0;
  for (const [ref, obj] of objects) {
    if (obj instanceof PDFRawStream) {
      const dict = obj.dict;
      if (dict.get(PDFName.of('Type')) === PDFName.of('XObject') && 
          dict.get(PDFName.of('Subtype')) === PDFName.of('Image')) {
        
        const width = dict.get(PDFName.of('Width'));
        const height = dict.get(PDFName.of('Height'));
        const w = typeof width?.value === 'number' ? width.value : (width?.numberValue || width || 0);
        const h = typeof height?.value === 'number' ? height.value : (height?.numberValue || height || 0);
        
        console.log(`Ref ${ref.objectNumber}: ${w}x${h}`);
        
        if (w === 2261) {
            let contents = obj.contents;
            // It's likely a DCTDecode (JPG)
            const filter = dict.get(PDFName.of('Filter'));
            console.log(`Filter: ${filter}`);
            
            // Just dump it directly
            fs.writeFileSync('bg_extracted.jpg', contents);
            
            // Generate a small preview
            await sharp(contents).resize(800).jpeg().toFile('bg_preview.jpg');
            console.log('Saved bg_extracted.jpg and bg_preview.jpg');
        }
      }
    }
  }
}

extractAll().catch(console.error);
