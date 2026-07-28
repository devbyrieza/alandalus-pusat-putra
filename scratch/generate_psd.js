const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const { writePsd } = require('ag-psd');

async function createPsd(pngPath, psdPath, layerName) {
    if (!fs.existsSync(pngPath)) {
        console.error('File tidak ditemukan:', pngPath);
        return;
    }
    
    const image = await loadImage(pngPath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    
    const psdData = {
        width: image.width,
        height: image.height,
        children: [
            {
                name: layerName,
                canvas: canvas
            }
        ]
    };
    
    const buffer = writePsd(psdData);
    fs.writeFileSync(psdPath, Buffer.from(buffer));
    console.log('Berhasil membuat PSD:', psdPath);
}

async function main() {
    const srcDir = path.resolve(__dirname, '../Kirim_ke_PT_TKI/Master_Blanko_Resolusi_Tinggi');
    const outDir = path.resolve(__dirname, '../Kirim_ke_PT_TKI/Desain_Asli_PSD');
    
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
    
    await createPsd(
        path.join(srcDir, 'BLANKO_DEPAN_HIGHRES.png'),
        path.join(outDir, 'MASTER_DEPAN_ALIMAM.psd'),
        'Background Depan'
    );
    
    await createPsd(
        path.join(srcDir, 'BLANKO_BELAKANG_HIGHRES.png'),
        path.join(outDir, 'MASTER_BELAKANG_ALIMAM.psd'),
        'Background Belakang'
    );
}

main().catch(console.error);
