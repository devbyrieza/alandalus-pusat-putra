const fs = require('fs');
const path = require('path');

function fixImages(filename) {
    const filePath = path.join(__dirname, '..', filename);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Change align-items: center to align-items: flex-start in .photo-box
    content = content.replace(/align-items:\s*center;\s*\/\*\s*photo-box\s*\*\//g, 'align-items: flex-start;'); // wait, let's just do a simpler replace
    
    // Find .photo-box CSS block and replace align-items
    const photoBoxIndex = content.indexOf('.photo-box {');
    if (photoBoxIndex !== -1) {
        const endIndex = content.indexOf('}', photoBoxIndex);
        let photoBoxCss = content.substring(photoBoxIndex, endIndex);
        photoBoxCss = photoBoxCss.replace('align-items: center;', 'align-items: flex-start;');
        content = content.substring(0, photoBoxIndex) + photoBoxCss + content.substring(endIndex);
    }

    // 2. Replace photo-bg div with img tag
    const photoBgRegex = /<div class="photo-bg" style="background-image: url\('([^']+)'\);"><\/div>/g;
    
    const imgStyle = `min-width: 100%; min-height: 100%; width: auto; height: auto; max-width: none; max-height: none; flex-shrink: 0; filter: brightness(1.25) contrast(1.08) saturate(1.1);`;
    
    content = content.replace(photoBgRegex, `<img src="$1" style="${imgStyle}">`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Applied flex-based object-fit polyfill to ${filename}`);
}

fixImages('id-card-panitia.html');
fixImages('id-card-santri.html');
