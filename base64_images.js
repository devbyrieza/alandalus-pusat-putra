const fs = require('fs');
const path = require('path');

const convertToBase64 = (filename) => {
    let content = fs.readFileSync(filename, 'utf8');
    
    // Find all <img src="..."> tags
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    const replacements = [];
    
    while ((match = imgRegex.exec(content)) !== null) {
        const fullTag = match[0];
        const srcPath = match[1];
        
        // Skip already base64 encoded images
        if (srcPath.startsWith('data:')) continue;
        
        // Resolve absolute path
        const absolutePath = path.resolve(__dirname, srcPath);
        if (fs.existsSync(absolutePath)) {
            const ext = path.extname(absolutePath).toLowerCase().replace('.', '');
            const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
            const base64Data = fs.readFileSync(absolutePath).toString('base64');
            const dataUrl = `data:${mimeType};base64,${base64Data}`;
            
            // Replace only the src attribute in this tag
            const newTag = fullTag.replace(srcPath, dataUrl);
            replacements.push({ old: fullTag, new: newTag });
        } else {
            console.log(`File not found: ${srcPath} (${absolutePath})`);
        }
    }
    
    // Apply replacements
    for (const r of replacements) {
        content = content.replace(r.old, r.new);
    }
    
    fs.writeFileSync(filename, content);
    console.log(`Converted images in ${filename}`);
};

convertToBase64('id-card-panitia.html');
convertToBase64('id-card-santri.html');
