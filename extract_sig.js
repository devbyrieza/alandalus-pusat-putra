const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const zlib = require('zlib');

async function extract() {
  const fileBytes = fs.readFileSync('fixed.pdf');
  const pdfDoc = await PDFDocument.load(fileBytes);
  const context = pdfDoc.context;
  const objects = context.enumerateIndirectObjects();
  
  for (const [ref, obj] of objects) {
    if (obj instanceof PDFRawStream) {
      const dict = obj.dict;
      if (dict.get(PDFName.of('Type')) === PDFName.of('XObject') && dict.get(PDFName.of('Subtype')) === PDFName.of('Image')) {
        const width = dict.get(PDFName.of('Width'));
        const w = typeof width?.value === 'number' ? width.value : (width?.numberValue || width || 0);
        if (w === 349) {
          let contents = obj.contents;
          if (dict.get(PDFName.of('Filter')) === PDFName.of('FlateDecode')) {
            contents = zlib.inflateSync(contents);
          }
          
          const cs = dict.get(PDFName.of('ColorSpace'));
          const bpc = dict.get(PDFName.of('BitsPerComponent'));
          
          console.log(`Extracted signature: ${w}x${dict.get(PDFName.of('Height'))}, CS: ${cs}, BPC: ${bpc}`);
          
          fs.writeFileSync('sig_raw.dat', contents);
          
          // Check for SMask
          const smaskRef = dict.get(PDFName.of('SMask'));
          if (smaskRef) {
             const smaskObj = context.lookup(smaskRef);
             let smaskContents = smaskObj.contents;
             if (smaskObj.dict.get(PDFName.of('Filter')) === PDFName.of('FlateDecode')) {
                 smaskContents = zlib.inflateSync(smaskContents);
             }
             fs.writeFileSync('sig_smask.dat', smaskContents);
             console.log('Extracted SMask as well.');
          }
        }
      }
    }
  }
}
extract().catch(console.error);
