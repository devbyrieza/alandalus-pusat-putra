const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'Bahan_ID_Card_AlImam/02_Preview_36_Kartu_Santri.html');
const destPath = path.join(__dirname, 'Preview_Kartu_Jajan_Mudir.html');

let srcHtml = fs.readFileSync(srcPath, 'utf8');

// Extract styles
let styles = '';
const styleMatch = srcHtml.match(/<style>([\s\S]*?)<\/style>/i);
if (styleMatch) {
    styles = styleMatch[1];
}

// Extract the first card
let firstCard = '';
const cardStartIdx = srcHtml.indexOf('<div class="id-card">');
if (cardStartIdx !== -1) {
    let chunk = srcHtml.substring(cardStartIdx);
    const nextCardIdx = chunk.indexOf('<div class="id-card">', 10);
    if (nextCardIdx !== -1) {
        firstCard = chunk.substring(0, nextCardIdx);
    } else {
        firstCard = chunk; // If only one card
    }
}

// Ensure firstCard is properly closed (it might have extra divs). Let's just grab the EXACT card block.
let chunk = srcHtml.substring(cardStartIdx);
const nextCardIdx = chunk.indexOf('<div class="id-card">', 10);
if (nextCardIdx !== -1) {
    firstCard = chunk.substring(0, nextCardIdx);
} else {
    firstCard = chunk.substring(0, chunk.indexOf('</body>'));
}

const template = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview Kartu Jajan Santri</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800;900&display=swap" rel="stylesheet">
    <style>
        ${styles}

        body {
            background: #111;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: 'Outfit', sans-serif;
            color: #fff;
        }

        .presentation-board {
            background: #1a1a1a;
            padding: 2.5rem 3rem;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            text-align: center;
            max-width: 500px;
            border: 1px solid #333;
        }

        .board-title {
            font-size: 1.5rem;
            font-weight: 800;
            color: #f0d890;
            margin-bottom: 0.5rem;
            letter-spacing: 1px;
        }

        .board-subtitle {
            font-size: 0.9rem;
            color: #aaa;
            margin-bottom: 2.5rem;
        }

        .card-wrapper {
            display: flex;
            justify-content: center;
        }

        /* Override some print styles for web view */
        .card {
            margin: 0; /* center it */
            box-shadow: 0 15px 35px rgba(0,0,0,0.4);
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    <div class="presentation-board">
        <div class="board-title">✨ Preview Kartu Jajan Santri ✨</div>
        <div class="board-subtitle">Spesifikasi Cetak: Bahan PVC Card (Tebal)</div>
        <div class="card-wrapper">
            ${firstCard}
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(destPath, template);
console.log('Done creating Preview_Kartu_Jajan_Mudir.html');
