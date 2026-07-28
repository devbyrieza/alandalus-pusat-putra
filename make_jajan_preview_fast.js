const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'Bahan_ID_Card_AlImam/01_Template_Kartu_AlImam.html');
const destPath = path.join(__dirname, 'Preview_Kartu_Jajan_Mudir.html');

let srcHtml = fs.readFileSync(srcPath, 'utf8');

let styles = '';
const styleMatch = srcHtml.match(/<style>([\s\S]*?)<\/style>/i);
if (styleMatch) {
    styles = styleMatch[1];
}

const cardHtmlMatch = srcHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let firstCard = '';
if(cardHtmlMatch) {
    firstCard = cardHtmlMatch[1];
}

// Encode student photo to base64
const fotoPath = path.join(__dirname, '../safina-keuangan/public/images/foto-kartu-jajan/abdul-aziz-ali.jpg');
let fotoB64 = '';
if (fs.existsSync(fotoPath)) {
    fotoB64 = 'data:image/jpeg;base64,' + fs.readFileSync(fotoPath).toString('base64');
}

// Replace placeholders with sample data
firstCard = firstCard.replace(/\{NAMA\}/g, 'ABDUL<br>AZIZ ALI');
firstCard = firstCard.replace(/\{NOMOR_INDUK\}/g, '2601070001');
if (fotoB64) {
    firstCard = firstCard.replace(/\{FOTO_SANTRI\}/g, fotoB64);
} else {
    firstCard = firstCard.replace(/\{FOTO_SANTRI\}/g, 'public/images/foto-kartu-jajan/abdul-aziz-ali.jpg');
}

const template = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview Kartu Jajan Santri</title>
    <!-- FontAwesome untuk Icon -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
            max-width: 800px;
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
            gap: 20px;
            flex-wrap: wrap;
        }

        /* Override some print styles for web view */
        .id-card {
            margin: 0; /* center it */
            box-shadow: 0 15px 35px rgba(0,0,0,0.4);
            page-break-inside: avoid;
        }
        
        @media (max-width: 700px) {
            .presentation-board {
                padding: 1.5rem 1rem;
            }
            .id-card {
                transform: scale(0.9);
                transform-origin: top center;
                margin-bottom: -40px;
            }
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
