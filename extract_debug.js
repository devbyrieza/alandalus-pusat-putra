const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const zlib = require('zlib');
const sharp = require('sharp');

async function extractDebug() {
  const filePath = path.resolve(__dirname, 'clean_fixed.pdf');
  const fileBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(fileBytes);
  
  const debugDir = path.resolve(__dirname, 'public/images/debug');
  if (!fs.existsSync(debugDir)) fs.mkdirSync(debugDir, { recursive: true });
  
  const context = pdfDoc.context;
  const objects = context.enumerateIndirectObjects();
  
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
        
        let contents = obj.contents;
        if (dict.get(PDFName.of('Filter')) === PDFName.of('FlateDecode')) {
          try { contents = zlib.inflateSync(contents); } catch(e){}
        }
        
        // Dump to file
        const outPath = path.join(debugDir, `img_${ref.objectNumber}_${w}x${h}`);
        if (dict.get(PDFName.of('Filter')) === PDFName.of('DCTDecode')) {
            fs.writeFileSync(`${outPath}.jpg`, contents);
        } else {
            fs.writeFileSync(`${outPath}.dat`, contents);
            // try convert to png
            try {
                // we need to know color space and bits per component, but sharp can often guess or we can just try raw
                if (w > 0 && h > 0) {
                    await sharp(contents, {
                        raw: { width: w, height: h, channels: contents.length / (w * h) }
                    }).png().toFile(`${outPath}.png`);
                }
            } catch(e) {
                console.log(`Could not sharp ${ref.objectNumber}`);
            }
        }
      }
    }
  }
}

extractDebug().catch(console.error);
