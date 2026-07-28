const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const zlib = require('zlib');

async function inspectDoc(filename, outname) {
    const fileBytes = fs.readFileSync(path.join(__dirname, 'public/documents', filename));
    const pdfDoc = await PDFDocument.load(fileBytes);
    
    // Dump page 1 contents
    const page = pdfDoc.getPages()[0];
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
    await inspectDoc('Contoh_SuratKesehatan.pdf', 'kesehatan_stream.txt');
    await inspectDoc('Contoh_PaktaIntegritas.pdf', 'pakta_stream.txt');
    await inspectDoc('Contoh_SuratPernyataan.pdf', 'pernyataan_stream.txt');
}

main().catch(console.error);
