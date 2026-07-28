const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const previewPath = path.join(root, 'Preview_IdCard.html');

console.log('Reading Preview_IdCard.html...');
const previewHtml = fs.readFileSync(previewPath, 'utf8');

// Find the logos-row in Preview_IdCard.html and extract all img src values
const logosRowMatch = previewHtml.match(/<div class="logos-row">([\s\S]*?)<\/div>/);
if (!logosRowMatch) {
    console.error('Could not find logos-row!');
    process.exit(1);
}

const logosRowContent = logosRowMatch[1];
console.log('Found logos-row content length:', logosRowContent.length);

// Extract all img src values from logos-row
const imgSrcRegex = /<img src="(data:image\/[^"]+)"/g;
const imgSrcs = [];
let m;
while ((m = imgSrcRegex.exec(logosRowContent)) !== null) {
    imgSrcs.push(m[1]);
}

console.log(`Found ${imgSrcs.length} logos`);
if (imgSrcs.length < 2) {
    console.error('Need at least 2 logos!');
    process.exit(1);
}

const logo1 = imgSrcs[0]; // first logo (Al-Imam)
const logo2 = imgSrcs[1]; // second logo (Andalus)
console.log('Logo 1 length:', logo1.length);
console.log('Logo 2 length:', logo2.length);

// The logos-row HTML to inject (same as in Preview_IdCard.html)
const logosRowHtml = `\n                <div class="logos-row">\n                    <img src="${logo1}">\n                    <img src="${logo2}">\n                </div>`;

// The CSS to inject for logos-row and photo-box background
const logosCss = `
        .logos-row {
            display: flex; justify-content: center; align-items: center;
            gap: 6px; margin-bottom: 4px;
        }
        .logos-row img { height: 16px; width: auto; opacity: 0.92; }
`;

function processFile(filename, isPanitia) {
    const filePath = path.join(root, filename);
    let content = fs.readFileSync(filePath, 'utf8');
    console.log(`\nProcessing ${filename}...`);

    // 1. Inject CSS for .logos-row if not present
    if (!content.includes('.logos-row')) {
        content = content.replace('.card-header {', logosCss + '\n        .card-header {');
        console.log('  Injected .logos-row CSS');
    } else {
        console.log('  .logos-row CSS already present');
    }

    // 2. Fix pesantren header text wrapping for panitia (no <br> in panitia currently)
    if (isPanitia) {
        const before = content;
        content = content.replace(
            /<div class="header-pesantren">PESANTREN AL-IMAM AL-ISLAMI<\/div>/g,
            '<div class="header-pesantren">PESANTREN<br>AL-IMAM AL-ISLAMI</div>'
        );
        if (content !== before) {
            console.log('  Fixed pesantren header text wrapping');
        }
    }

    // 3. Add logos-row inside card-header divs (only if not already present)
    let injectedCount = 0;
    content = content.replace(/<div class="card-header">\s*(?!<div class="logos-row">)/g, (match) => {
        injectedCount++;
        return `<div class="card-header">${logosRowHtml}\n`;
    });
    console.log(`  Injected logos-row into ${injectedCount} card-header(s)`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Saved ${filename}`);
}

processFile('id-card-panitia.html', true);
processFile('id-card-santri.html', false);

console.log('\nDone!');
