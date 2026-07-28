const fs = require('fs');
const path = require('path');

function run() {
    const file = path.join(__dirname, 'nilai_db.jsonl');
    if (!fs.existsSync(file)) {
        console.error("File does not exist!");
        return;
    }
    const content = fs.readFileSync(file, 'utf16le');
    // Save as UTF-8
    fs.writeFileSync(file, content, 'utf8');
    console.log("Successfully converted nilai_db.jsonl to UTF-8!");
    console.log("First 300 chars of converted file:");
    console.log(content.substring(0, 300));
}

run();
