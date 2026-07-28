const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName } = require('pdf-lib');

async function getFonts(filename) {
    const fileBytes = fs.readFileSync(path.join(__dirname, 'public/documents', filename));
    const pdfDoc = await PDFDocument.load(fileBytes);
    
    let allFonts = new Set();
    const pages = pdfDoc.getPages();
    for (const page of pages) {
        const resources = page.node.Resources();
        if (resources) {
            const fonts = resources.get(PDFName.of('Font'));
            if (fonts && fonts.dict) {
                const keys = fonts.keys();
                for (const key of keys) {
                    const fontObj = pdfDoc.context.lookup(fonts.get(key));
                    if (fontObj && fontObj.dict) {
                        const baseFont = fontObj.dict.get(PDFName.of('BaseFont'));
                        if (baseFont && baseFont.name) {
                            allFonts.add(baseFont.name);
                        } else if (baseFont) {
                            allFonts.add(baseFont);
                        }
                    }
                }
            }
        }
    }
    console.log(`Fonts in ${filename}:`);
    for (const f of allFonts) {
        console.log(` - ${f}`);
    }
}

async function main() {
    await getFonts('PDF 003-Surat Undangan Welcome Day Pesantren Al Imam Al Islami.pdf');
    await getFonts('Surat Pemberitahuan Kedatangan Santri Baru 2026-2027.pdf');
}
main().catch(console.error);
