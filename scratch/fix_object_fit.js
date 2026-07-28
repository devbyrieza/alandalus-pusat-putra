const fs = require('fs');
const path = require('path');

function fixObjectFit(filename) {
    const filePath = path.join(__dirname, '..', filename);
    let content = fs.readFileSync(filePath, 'utf8');

    // Add .photo-bg CSS if it doesn't exist
    if (!content.includes('.photo-bg {')) {
        const cssReplacement = `.photo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top center;
            filter: brightness(1.25) contrast(1.08) saturate(1.1);
            display: block;
        }`;
        const newCss = `.photo-bg {
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: top center;
            background-repeat: no-repeat;
            filter: brightness(1.25) contrast(1.08) saturate(1.1);
        }`;
        
        if (content.includes(cssReplacement)) {
            content = content.replace(cssReplacement, newCss);
        } else {
            // Just insert it before </style>
            content = content.replace('</style>', newCss + '\n</style>');
        }
    }

    // Replace <img src="..."> inside <div class="photo-box"> with <div class="photo-bg" style="background-image: url(...)"></div>
    const photoBoxRegex = /<div class="photo-box">\s*<img src="(data:image\/[^"]+)">\s*<\/div>/g;
    
    const originalLength = content.length;
    content = content.replace(photoBoxRegex, `<div class="photo-box">\n                    <div class="photo-bg" style="background-image: url('$1');"></div>\n                </div>`);

    if (content.length !== originalLength || content.includes('.photo-bg')) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed object-fit issue in ${filename}`);
    } else {
        console.log(`No changes made to ${filename}`);
    }
}

fixObjectFit('id-card-panitia.html');
fixObjectFit('id-card-santri.html');
