const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const zlib = require('zlib');
const sharp = require('sharp');

async function processDoc(filename, isPemberitahuan, isKesehatan) {
    const docDir = path.resolve(__dirname, 'public/documents');
    const imagesDir = path.resolve(__dirname, 'public/images');
    const headerPath = path.join(imagesDir, 'kop_header_alimam.jpg');
    
    const srcPath = isPemberitahuan ? 'clean_fixed.pdf' : path.join(docDir, filename);
    const fileBytes = fs.readFileSync(srcPath);
    let pdfDoc = await PDFDocument.load(fileBytes);
    
    const headerImgBytes = fs.readFileSync(headerPath);
    const stampBytes = fs.readFileSync(path.join(docDir, 'Stempel 5.png'));
    const bgBytes = fs.readFileSync(path.join(imagesDir, 'debug', 'img_5_2261x3200.jpg'));
    const sigBytes = fs.readFileSync(path.join(imagesDir, 'real_sig_transparent.png'));
    
    const headerImage = await pdfDoc.embedJpg(headerImgBytes);
    const stampImage = await pdfDoc.embedPng(stampBytes);
    const bgImage = await pdfDoc.embedJpg(bgBytes);
    const sigImage = await pdfDoc.embedPng(sigBytes);
    
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
        xobjs.set(PDFName.of('BgImg'), bgImage.ref);
        xobjs.set(PDFName.of('SigImg'), sigImage.ref);
        
        const headerH = w * (520 / 2261);
        const kopDrawStr = `\nq ${w} 0 0 ${headerH} 0 ${h - headerH} cm /KopHeaderImg Do Q\n`;
        const bgDrawStr = `\nq ${w} 0 0 ${h} 0 0 cm /BgImg Do Q\n`;
        
        const contentsRef = page.node.get(PDFName.of('Contents'));
        const contentsArray = (contentsRef.asArray ? contentsRef.asArray() : (contentsRef ? [contentsRef] : []));
        
        if (isPemberitahuan && i === 0) {
            let newArray = [];
            for (const ref of contentsArray) {
                const obj = pdfDoc.context.lookup(ref);
                if (obj instanceof PDFRawStream) {
                   let data = obj.contents;
                   if (obj.dict.get(PDFName.of('Filter')) === PDFName.of('FlateDecode')) {
                      try { data = zlib.inflateSync(data); } catch(e){}
                   }
                   let streamStr = data.toString('utf8');
                   
                   streamStr = streamStr.replace(/\/Image10 Do/g, ''); // Ensure we don't draw any leftover green stamps
                   
                   // Signature image is at: x=261.75, y=213.76, w=143.99, h=77.15
                   // Place stamp to the LEFT of signature, centered vertically
                   // Stamp is 108x108: x = 261.75 - 110 = 151.75, y = 213.76 - 15 = 198.76
                   const stampDrawStr = `\nq 108 0 0 108 152 199 cm /NewStampImg Do Q\n`;
                   streamStr = streamStr.replace(/261\.75 213\.76 143\.99 77\.15 re/g, stampDrawStr + '261.75 213.76 143.99 77.15 re');
                   
                   const newStream = pdfDoc.context.flateStream(streamStr);
                   const newRef = pdfDoc.context.register(newStream);
                   newArray.push(newRef);
                } else {
                   newArray.push(ref);
                }
            }
            page.node.set(PDFName.of('Contents'), pdfDoc.context.obj(newArray));
        } else if (isPemberitahuan) {
            // Do not inject Kop Surat here; the Word document already has it.
            // Just leave the contents as is.
        } else {
            const bgStream = pdfDoc.context.flateStream(bgDrawStr);
            const bgRef = pdfDoc.context.register(bgStream);
            const kopStream = pdfDoc.context.flateStream(kopDrawStr);
            const kopRef = pdfDoc.context.register(kopStream);
            
            let extraRef = null;
            if (isKesehatan && i === 0) {
                // Name is now at y=100.58. 
                // Sig: x=255, y=85.24. Stamp: x=185, y=93.24
                const drawStr = `\nq 108 0 0 108 185 93.24 cm /NewStampImg Do Q\n` + 
                                `q 110 0 0 75 255 85.24 cm /SigImg Do Q\n`;
                const extraStream = pdfDoc.context.flateStream(drawStr);
                extraRef = pdfDoc.context.register(extraStream);
            }
            
            const newArray = [bgRef, ...contentsArray, kopRef];
            if (extraRef) {
                newArray.push(extraRef); 
            }
            page.node.set(PDFName.of('Contents'), pdfDoc.context.obj(newArray));
        }
    }
    
    fs.writeFileSync(path.join(docDir, filename), await pdfDoc.save());
    console.log(`Successfully generated ${filename}!`);
}

async function main() {
    await processDoc('Surat Pemberitahuan Kedatangan Santri Baru 2026/2027.pdf', true, false);
    await processDoc('Contoh_SuratKesehatan.pdf', false, true);
    await processDoc('Contoh_PaktaIntegritas.pdf', false, false);
    await processDoc('Contoh_SuratPernyataan.pdf', false, false);
}
main().catch(console.error);
