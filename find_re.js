const fs = require('fs');
const { PDFDocument, PDFRawStream, PDFName } = require('pdf-lib');
const zlib = require('zlib');

async function main() {
    const fileBytes = fs.readFileSync('clean_fixed.pdf');
    const pdfDoc = await PDFDocument.load(fileBytes);
    const pages = pdfDoc.getPages();
    const page = pages[0];
    
    const contentsRef = page.node.get(PDFName.of('Contents'));
    const contentsArray = (contentsRef.asArray ? contentsRef.asArray() : [contentsRef]);
    
    for (const ref of contentsArray) {
        const obj = pdfDoc.context.lookup(ref);
        if (obj instanceof PDFRawStream) {
            let data = obj.contents;
            if (obj.dict.get(PDFName.of('Filter')) === PDFName.of('FlateDecode')) {
                try { data = zlib.inflateSync(data); } catch(e){}
            }
            const str = data.toString('utf8');
            // We want to find the line that draws Image10 or similar
            const match = str.match(/([0-9.]+ [0-9.]+ [0-9.]+ [0-9.]+) re/g);
            if (match) {
                console.log(match);
            }
        }
    }
}
main();
