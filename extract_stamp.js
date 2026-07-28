const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const sharp = require('sharp');

async function extractStamp() {
  const filePath = path.resolve(__dirname, 'Surat_Pengantar_BSI_Stempel.pdf');
  const fileBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(fileBytes);
  
  const context = pdfDoc.context;
  const objects = context.enumerateIndirectObjects();
  
  let count = 0;
  for (const [ref, obj] of objects) {
    if (obj instanceof PDFRawStream) {
      const dict = obj.dict;
      if (dict.get(PDFName.of('Type')) === PDFName.of('XObject') && 
          dict.get(PDFName.of('Subtype')) === PDFName.of('Image')) {
        
        const width = dict.get(PDFName.of('Width'));
        const height = dict.get(PDFName.of('Height'));
        const w = typeof width?.value === 'number' ? width.value : (width?.numberValue || width || 0);
        const h = typeof height?.value === 'number' ? height.value : (height?.numberValue || height || 0);
        
        console.log(`Found image Ref ${ref.objectNumber}: ${w}x${h}`);
        
        // Stempel is usually small, e.g. 200-400px
        if (w > 100 && w < 1000 && h > 100 && h < 1000) {
            let contents = obj.contents;
            // Determine extension based on filter
            const filter = dict.get(PDFName.of('Filter'))?.name;
            const ext = filter === 'FlateDecode' ? 'png' : 'jpg';
            const filename = `stempel_extracted_${count}.${ext}`;
            fs.writeFileSync(filename, contents);
            console.log(`Saved ${filename}`);
            count++;
        }
      }
    }
  }
}

extractStamp().catch(console.error);
