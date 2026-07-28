const fs = require('fs');
const path = require('path');

const xmlPath = path.resolve(__dirname, 'temp_docx/word/document.xml');
let xml = fs.readFileSync(xmlPath, 'utf8');

// Find the exact string:
const searchStr = '<w:t>4. Begitu tiba di pesantren';
const replaceStr = '<w:t>4.</w:t></w:r><w:r><w:tab/></w:r><w:r><w:t>Begitu tiba di pesantren';

if (xml.includes(searchStr)) {
  xml = xml.replace(searchStr, replaceStr);
  fs.writeFileSync(xmlPath, xml, 'utf8');
  console.log("Successfully fixed document.xml!");
} else {
  console.log("Could not find the search string!");
}
