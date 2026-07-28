const fs = require('fs');
const path = require('path');

function fixDuplicates(filename) {
    const filePath = path.join(__dirname, '..', filename);
    let content = fs.readFileSync(filePath, 'utf8');

    const parts = content.split('<div class="card-header">');
    
    for (let i = 1; i < parts.length; i++) {
        let part = parts[i];
        
        const logosRowRegex = /<div class="logos-row">[\s\S]*?<\/div>/g;
        const matches = [...part.matchAll(logosRowRegex)];
        
        if (matches.length > 1) {
            const firstLogosRow = matches[0][0];
            part = part.replace(logosRowRegex, '');
            parts[i] = '\n                ' + firstLogosRow + part;
        }
    }
    
    const newContent = parts.join('<div class="card-header">');
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Fixed duplicates in ${filename}`);
    } else {
        console.log(`No duplicates needed fixing in ${filename}`);
    }
}

fixDuplicates('id-card-panitia.html');
fixDuplicates('id-card-santri.html');
