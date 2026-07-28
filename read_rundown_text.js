const fs = require('fs');
const pdf = require('pdf-parse');

const dataBuffer = fs.readFileSync('C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/public/documents/roundown.pdf');

pdf(dataBuffer).then(function(data) {
    console.log("=== RUNDOWN PDF TEXT ===");
    console.log(data.text);
}).catch(err => {
    console.error(err);
});
