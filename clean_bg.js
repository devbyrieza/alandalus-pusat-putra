const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function run() {
    const bgPath = path.join(__dirname, 'public/images/kop-surat-full.jpg');
    const bgCleanPath = path.join(__dirname, 'public/images/kop-surat-clean.jpg');
    
    const image = sharp(bgPath);
    const metadata = await image.metadata();
    console.log(`Dimensions: ${metadata.width}x${metadata.height}`);
    
    // We want to overlay a white rectangle at the bottom right.
    // The image width is metadata.width, height is metadata.height.
    // Let's find out how many pixels the signature area occupies.
    // Usually, the signature block is at the bottom right, above the red/brown footer.
    // The footer is at the very bottom.
    // In A4 96dpi (794x1123), the footer is about 40-50px tall.
    // In high-res (e.g. 2480x3508), it's larger.
    // Let's create a white rectangle.
    // For 794x1123:
    // Left: 400, Top: 850, Width: 350, Height: 200.
    // Let's calculate relative to metadata width and height:
    // Left: 50% of width
    // Top: 78% of height
    // Width: 45% of width
    // Height: 16% of height
    
    const w = metadata.width;
    const h = metadata.height;
    
    const rectWidth = 1733;
    const rectLeft = 200;
    const rectHeight = 250;
    const rectTop = 2850;
    
    console.log(`Overlay rect: left=${rectLeft}, top=${rectTop}, width=${rectWidth}, height=${rectHeight}`);
    
    // Create a white image of the size of the rectangle
    const whiteBox = await sharp({
        create: {
            width: rectWidth,
            height: rectHeight,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
    }).png().toBuffer();
    
    // Composite the white image over the original background
    await image
        .composite([{
            input: whiteBox,
            left: rectLeft,
            top: rectTop
        }])
        .toFile(bgCleanPath);
        
    console.log('Created clean background: public/images/kop-surat-clean.jpg');
}

run().catch(console.error);
