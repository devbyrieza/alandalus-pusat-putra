const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const zlib = require('zlib');
const sharp = require('sharp');

async function main() {
  const docDir = path.resolve(__dirname, 'public/documents');
  const imagesDir = path.resolve(__dirname, 'public/images');
  
  const headerPath = path.join(imagesDir, 'kop_header_alimam.jpg');
  if (!fs.existsSync(headerPath)) {
      await sharp(path.join(imagesDir, 'kop-surat-full.jpg')).extract({ left: 0, top: 0, width: 2261, height: 520 }).toFile(headerPath);
  }
  
  const fileBytes = fs.readFileSync('clean_fixed.pdf');
  let pdfDoc = await PDFDocument.load(fileBytes);
  
  const headerImgBytes = fs.readFileSync(headerPath);
  const stampBytes = fs.readFileSync(path.join(docDir, 'Stempel 1.png'));
  const headerImage = await pdfDoc.embedJpg(headerImgBytes);
  const stampImage = await pdfDoc.embedPng(stampBytes);
  
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width: w, height: h } = page.getSize();
      
      let xobjs = page.node.Resources().get(PDFName.of('XObject'));
      xobjs.set(PDFName.of('KopHeaderImg'), headerImage.ref);
      xobjs.set(PDFName.of('NewStampImg'), stampImage.ref);
      
      const headerH = w * (520 / 2261);
      const kopDrawStr = `\nq ${w} 0 0 ${headerH} 0 ${h - headerH} cm /KopHeaderImg Do Q\n`;
      
      const contentsRef = page.node.get(PDFName.of('Contents'));
      const contentsArray = (contentsRef.asArray ? contentsRef.asArray() : (contentsRef ? [contentsRef] : []));
      
      if (i === 0) {
          let newArray = [];
          for (const ref of contentsArray) {
              const obj = pdfDoc.context.lookup(ref);
              if (obj instanceof PDFRawStream) {
                 let data = obj.contents;
                 if (obj.dict.get(PDFName.of('Filter')) === PDFName.of('FlateDecode')) {
                    try { data = zlib.inflateSync(data); } catch(e){}
                 }
                 let streamStr = data.toString('utf8');
                 
                 // Remove Image10 Do entirely
                 streamStr = streamStr.replace(/\/Image10 Do/g, '');
                 
                 // Adjust stamp position to perfectly center it behind the signature
                 // Text baseline is at y=148. Signature is y=133.38 to y=209.
                 // We put stamp at y=142 so it barely touches the text, and x=380 so it's slightly left of the signature center (427).
                 // Size is 75 so it fits nicely inside the signature area.
                 const stampDrawStr = `\nq 75 0 0 75 380 142 cm /NewStampImg Do Q\n`;
                 streamStr = streamStr.replace(/372\.5 133\.38 110\.24 75\.9 re/g, stampDrawStr + '372.5 133.38 110.24 75.9 re');
                 
                 const newStream = pdfDoc.context.flateStream(streamStr);
                 const newRef = pdfDoc.context.register(newStream);
                 newArray.push(newRef);
              } else {
                 newArray.push(ref);
              }
          }
          
          const kopStream = pdfDoc.context.flateStream(kopDrawStr);
          const kopRef = pdfDoc.context.register(kopStream);
          newArray.push(kopRef);
          
          page.node.set(PDFName.of('Contents'), pdfDoc.context.obj(newArray));
      } else {
          const kopStream = pdfDoc.context.flateStream(kopDrawStr);
          const kopRef = pdfDoc.context.register(kopStream);
          
          const newArray = [...contentsArray, kopRef];
          page.node.set(PDFName.of('Contents'), pdfDoc.context.obj(newArray));
      }
  }
  
  const finalPath = path.join(docDir, 'Surat Pemberitahuan Kedatangan Santri Baru 2026-2027.pdf');
  fs.writeFileSync(finalPath, await pdfDoc.save());
  console.log("Successfully generated perfect PDF!");
}
main().catch(console.error);
