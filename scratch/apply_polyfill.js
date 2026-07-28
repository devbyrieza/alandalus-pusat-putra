const fs = require('fs');
const path = require('path');

const polyfillCode = `            // Polyfill object-fit for html2canvas
            const photoBox = card.querySelector('.photo-box');
            let img = null, origStyle = '', origDisplay = '';
            if (photoBox) {
                img = photoBox.querySelector('img');
                if (img) {
                    origStyle = img.getAttribute('style') || '';
                    origDisplay = photoBox.style.display;
                    const boxW = photoBox.clientWidth;
                    const boxH = photoBox.clientHeight;
                    const imgW = img.naturalWidth;
                    const imgH = img.naturalHeight;
                    
                    if (imgW > 0 && imgH > 0 && boxW > 0 && boxH > 0) {
                        const boxRatio = boxW / boxH;
                        const imgRatio = imgW / imgH;
                        
                        let finalW, finalH;
                        if (imgRatio > boxRatio) {
                            finalH = boxH;
                            finalW = boxH * imgRatio;
                        } else {
                            finalW = boxW;
                            finalH = boxW / imgRatio;
                        }
                        
                        const marginLeft = (boxW - finalW) / 2;
                        
                        img.setAttribute('style', \`width: \${finalW}px !important; height: \${finalH}px !important; margin-left: \${marginLeft}px !important; margin-top: 0px !important; max-width: none !important; max-height: none !important; filter: brightness(1.25) contrast(1.08) saturate(1.1);\`);
                        photoBox.style.display = 'block';
                    }
                }
            }

            // Render card`;

const revertCode = `            // Revert polyfill
            if (img && photoBox) {
                if (origStyle) {
                    img.setAttribute('style', origStyle);
                } else {
                    img.removeAttribute('style');
                }
                photoBox.style.display = origDisplay;
            }
            
            card.style.transform = originalTransform;`;

function applyPolyfill(filename) {
    const filePath = path.join(__dirname, '..', filename);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Revert align-items back to center
    content = content.replace(/align-items: flex-start;/g, 'align-items: center;');

    // 2. Remove the fake CSS style from img
    const fakeStyle = ' style="min-width: 100%; min-height: 100%; width: auto; height: auto; max-width: none; max-height: none; flex-shrink: 0; filter: brightness(1.25) contrast(1.08) saturate(1.1);"';
    content = content.split(fakeStyle).join('');

    // 3. Inject polyfill before html2canvas
    if (!content.includes('Polyfill object-fit for html2canvas')) {
        content = content.replace('// Render card', polyfillCode);
    }

    // 4. Inject revert code
    if (!content.includes('Revert polyfill')) {
        content = content.replace('card.style.transform = originalTransform;', revertCode);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Applied JS polyfill to ${filename}`);
}

applyPolyfill('id-card-panitia.html');
applyPolyfill('id-card-santri.html');
