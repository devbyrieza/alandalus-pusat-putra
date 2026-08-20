const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const zlib = require('zlib');

async function inspectDoc(filename, outname) {
    const fileBytes = fs.readFileSync(path.join(__dirname, 'public/documents', filename));
    const pdfDoc = await PDFDocument.load(fileBytes);
    
    let allFonts = new Set();
    const pages = pdfDoc.getPages();
    for (const page of pages) {
        const resources = page.node.Resources();
        if (resources) {
            const fonts = resources.get(PDFName.of('Font'));
            if (fonts) {
                const keys = fonts.keys();
                for (const key of keys) {
                    const fontObj = pdfDoc.context.lookup(fonts.get(key));
                    if (fontObj && fontObj.dict) {
                        const baseFont = fontObj.dict.get(PDFName.of('BaseFont'));
                        if (baseFont) {
                            allFonts.add(baseFont.name);
                        }
                    }
                }
            }
        }
    }
    console.log(`\nFonts in ${filename}:`);
    for (const f of allFonts) {
        console.log(` - ${f}`);
    }
    
    // Dump page 1 contents
    const page = pages[0];
    const contentsRef = page.node.get(PDFName.of('Contents'));
    const contentsArray = (contentsRef.asArray ? contentsRef.asArray() : (contentsRef ? [contentsRef] : []));
    let text = '';
    for (const ref of contentsArray) {
        const obj = pdfDoc.context.lookup(ref);
        if (obj instanceof PDFRawStream) {
            let data = obj.contents;
            if (obj.dict.get(PDFName.of('Filter')) === PDFName.of('FlateDecode')) {
                try { data = zlib.inflateSync(data); } catch(e){}
            }
            text += data.toString('utf8') + '\n';
        }
    }
    fs.writeFileSync(outname, text);
    console.log(`Dumped Page 1 of ${filename} to ${outname}`);
}

async function main() {
    await inspectDoc('PDF 003-Surat Undangan Welcome Day Pesantren Al Imam Al Islami.pdf', 'pdf003_stream.txt');
    await inspectDoc('Surat Pemberitahuan Kedatangan Santri Baru 2026/2027.pdf', 'sp_stream.txt');
}

main().catch(console.error);
