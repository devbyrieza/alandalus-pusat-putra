const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFRawStream, PDFRef, PDFArray } = require('pdf-lib');
const sharp = require('sharp');

async function main() {
  try {
    const docDir = path.resolve(__dirname, 'public/documents');
    const imagesDir = path.resolve(__dirname, 'public/images');
    
    // Kop Header
    const headerPath = path.join(imagesDir, 'kop_header_alimam.jpg');
    if (!fs.existsSync(headerPath)) {
        await sharp(path.join(imagesDir, 'kop-surat-full.jpg')).extract({ left: 0, top: 0, width: 2261, height: 520 }).toFile(headerPath);
    }
    
    const fileBytes = fs.readFileSync('clean_fixed.pdf');
    let pdfDoc = await PDFDocument.load(fileBytes);
    const context = pdfDoc.context;
    
    // Hide old stamp and signature artifact
    const objects = context.enumerateIndirectObjects();
    for (const [ref, obj] of objects) {
      if (obj instanceof PDFRawStream) {
        const dict = obj.dict;
        if (dict.get(PDFName.of('Type')) === PDFName.of('XObject') && dict.get(PDFName.of('Subtype')) === PDFName.of('Image')) {
          const width = dict.get(PDFName.of('Width'));
          const w = typeof width?.value === 'number' ? width.value : (width?.numberValue || width || 0);
          
          if (w === 320 || w === 349) {
            obj.contents = new Uint8Array(0);
          }
        }
      }
    }
    
    // Embed assets
    const headerImgBytes = fs.readFileSync(headerPath);
    const stampBytes = fs.readFileSync(path.join(docDir, 'Stempel 1.png'));
    
    const headerImage = await pdfDoc.embedJpg(headerImgBytes);
    const stampImage = await pdfDoc.embedPng(stampBytes);
    
    const pages = pdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width: w, height: h } = page.getSize();
        
        let xobjs = page.node.Resources().get(PDFName.of('XObject'));
        if (!xobjs) {
          xobjs = pdfDoc.context.obj({});
          page.node.Resources().set(PDFName.of('XObject'), xobjs);
        }
        xobjs.set(PDFName.of('KopHeaderImg'), headerImage.ref);
        xobjs.set(PDFName.of('NewStampImg'), stampImage.ref);
        
        const headerH = w * (520 / 2261);
        let drawStr = `q ${w} 0 0 ${headerH} 0 ${h - headerH} cm /KopHeaderImg Do Q\n`;
        
        // Draw stamp on Page 1 (index 0) where the signature actually is
        if (i === 0) {
            drawStr += `q 90 0 0 90 355 120 cm /NewStampImg Do Q\n`;
        }
        
        const stream = pdfDoc.context.flateStream(drawStr);
        const streamRef = pdfDoc.context.register(stream);
        
        const contentsRaw = page.node.get(PDFName.of('Contents'));
        let newContents;
        if (contentsRaw instanceof PDFArray) {
            newContents = pdfDoc.context.obj([streamRef, ...contentsRaw.asArray()]);
        } else if (contentsRaw instanceof PDFRef) {
            newContents = pdfDoc.context.obj([streamRef, contentsRaw]);
        } else {
            newContents = pdfDoc.context.obj([streamRef]);
        }
        page.node.set(PDFName.of('Contents'), newContents);
    }
    
    const finalPath = path.join(docDir, 'Surat Pemberitahuan Kedatangan Santri Baru 2026-2027.pdf');
    fs.writeFileSync(finalPath, await pdfDoc.save());
    console.log("Successfully generated clean PDF!");
    
  } catch (err) {
    console.error(err);
  }
}
main();
