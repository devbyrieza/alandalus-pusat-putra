const fs = require('fs');
const path = require('path');

function fixPanitia() {
    const filename = 'id-card-panitia.html';
    const filePath = path.join(__dirname, '..', filename);
    let content = fs.readFileSync(filePath, 'utf8');

    // In panitia, we need to remove the second logo (which is the green Mosa logo)
    // The structure is:
    // <div class="logos-row">
    //     <img src="...">
    //     <img src="...">
    // </div>
    // We want to keep only the first img in every .logos-row
    
    // We can do this by regex or by splitting
    // Since base64 is huge, let's use a regex that matches the second img in logos-row
    // Actually, simpler: replace `<div class="logos-row">` with a unique marker, then find the two imgs and remove the second.
    
    // But since there might be multiple cards, we need to replace it globally.
    let count = 0;
    content = content.replace(/<div class="logos-row">\s*<img src="([^"]+)">\s*<img src="([^"]+)">\s*<\/div>/g, (match, src1, src2) => {
        count++;
        return `<div class="logos-row">\n                    <img src="${src1}">\n                </div>`;
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed Panitia: removed second logo in ${count} places.`);
}

function fixSantri() {
    const filename = 'id-card-santri.html';
    const filePath = path.join(__dirname, '..', filename);
    let content = fs.readFileSync(filePath, 'utf8');

    // In santri, we need to update the text.
    // 1. "Welcome Day Santri Baru 2026" -> "Welcome Day & Mosa Santri Baru 2026"
    content = content.replace(/Welcome Day Santri Baru 2026/g, 'Welcome Day & Mosa Santri Baru 2026');

    // 2. "WELCOME DAY · AL-IMAM · 2026" -> "WELCOME DAY & MOSA · AL-IMAM · 2026"
    content = content.replace(/WELCOME DAY · AL-IMAM · 2026/g, 'WELCOME DAY & MOSA · AL-IMAM · 2026');
    
    // Also update title
    content = content.replace(/Welcome Day Pesantren Al-Imam Al-Islami 2026/g, 'Welcome Day & Mosa Pesantren Al-Imam Al-Islami 2026');
    
    // Also update paragraph
    content = content.replace(/<p>Welcome Day · /g, '<p>Welcome Day & Mosa · ');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed Santri: updated text to include Mosa.`);
}

fixPanitia();
fixSantri();
