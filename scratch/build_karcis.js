const fs = require('fs');
const path = require('path');

// Read the logo from id-card-panitia.html
const panitiaPath = path.join(__dirname, '..', 'id-card-panitia.html');
const panitiaContent = fs.readFileSync(panitiaPath, 'utf8');
const logoMatch = panitiaContent.match(/<img src="(data:image\/png;base64,[^"]+)">/);
let logoBase64 = '';
if (logoMatch) {
    logoBase64 = logoMatch[1];
}

let htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Karcis Parkir Mobil - Welcome Day 2026</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #4a0d0d; /* Maroon/Dark Red */
            --secondary: #d4af37; /* Gold */
            --white: #ffffff;
            --light-gold: #fdf5e6;
        }

        body {
            margin: 0;
            padding: 20px;
            font-family: 'Outfit', sans-serif;
            background-color: #f0f0f0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .print-btn {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: 0.3s;
        }

        .print-btn:hover {
            background-color: #218838;
            transform: translateY(-2px);
        }

        .tickets-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            width: 100%;
            max-width: 210mm; /* A4 width */
        }

        .ticket {
            width: 140mm;
            height: 55mm;
            background: var(--primary);
            border-radius: 10px;
            display: flex;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            color: var(--white);
            border: 2px solid var(--secondary);
            box-sizing: border-box;
        }

        /* Decorative background pattern */
        .ticket::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background-image: url('data:image/svg+xml;utf8,<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 0l20 20-20 20L0 20z" fill="%23d4af37" fill-opacity="0.05" fill-rule="evenodd"/></svg>');
            pointer-events: none;
            z-index: 1;
        }

        .stub {
            width: 38mm;
            background: var(--light-gold);
            border-right: 2px dashed var(--secondary);
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--primary);
            position: relative;
            z-index: 2;
        }

        .stub-content {
            transform: rotate(-90deg);
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
        }

        .stub .vertical-text {
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 1px;
            color: var(--secondary);
            text-shadow: 1px 1px 0px rgba(0,0,0,0.1);
        }

        .stub .number {
            font-size: 14px;
            font-weight: 700;
            background: var(--primary);
            color: var(--secondary);
            padding: 3px 10px;
            border-radius: 20px;
        }

        .main {
            flex: 1;
            padding: 10px 18px;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 2;
        }

        .main-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .logo-title {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo-title img {
            height: 35px;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }

        .header-text h3 {
            margin: 0;
            font-size: 11px;
            font-weight: 400;
            color: var(--white);
            letter-spacing: 1px;
        }

        .header-text h1 {
            margin: 0;
            font-size: 16px;
            font-weight: 700;
            color: var(--secondary);
        }

        .ticket-number {
            font-size: 22px;
            font-weight: 800;
            color: var(--secondary);
            background: rgba(0,0,0,0.3);
            padding: 4px 10px;
            border-radius: 6px;
            border: 1px solid var(--secondary);
        }

        .title-area {
            text-align: center;
            margin-top: 8px;
            flex: 1;
        }

        .title-area h2 {
            margin: 0;
            font-size: 26px;
            font-weight: 800;
            color: var(--secondary);
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .title-area p {
            margin: 2px 0 0 0;
            font-size: 11px;
            font-weight: 300;
            color: var(--white);
            letter-spacing: 3px;
        }

        .footer-area {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: auto;
        }

        .footer-note {
            font-size: 9px;
            line-height: 1.4;
            color: rgba(255,255,255,0.85);
            max-width: 60%;
            margin-bottom: 2px;
        }
        .footer-note ul {
            margin: 0;
            padding-left: 12px;
            list-style-type: disc;
        }

        .signature-area {
            text-align: center;
            width: 120px;
        }

        .signature-area p {
            margin: 0;
            font-size: 10px;
            color: var(--secondary);
            font-weight: 600;
        }

        .signature-space {
            height: 30px;
            background-color: var(--light-gold);
            border-radius: 4px;
            margin: 2px 0;
            border: 1px solid var(--secondary);
            /* Placeholder for signature */
        }

        .signature-name {
            font-size: 11px !important;
            color: var(--white) !important;
            font-weight: 700 !important;
            text-decoration: underline;
        }

        @media print {
            @page {
                size: A4;
                margin: 3mm;
            }
            body {
                background-color: white;
                padding: 0;
            }
            .print-btn {
                display: none;
            }
            .ticket {
                page-break-inside: avoid;
                margin-bottom: 0;
                box-shadow: none;
            }
            .tickets-container {
                gap: 2mm;
            }
        }
    </style>
</head>
<body>

    <button class="print-btn" onclick="window.print()">🖨️ Print Karcis (PDF/A4)</button>

    <div class="tickets-container">
`;

// Generate 150 tickets
for (let i = 1; i <= 150; i++) {
    const num = String(i).padStart(3, '0');
    
    htmlContent += `
        <div class="ticket">
            <div class="stub">
                <div class="stub-content">
                    <div class="number">#${num}</div>
                    <div class="vertical-text">PARKIR MOBIL</div>
                </div>
            </div>
            <div class="main">
                <div class="main-header">
                    <div class="logo-title">
                        <img src="${logoBase64}" alt="Logo">
                        <div class="header-text">
                            <h3>PESANTREN AL-IMAM AL-ISLAMI</h3>
                            <h1>Welcome Day 2026</h1>
                        </div>
                    </div>
                    <div class="ticket-number">#${num}</div>
                </div>
                
                <div class="title-area">
                    <h2>KARCIS PARKIR</h2>
                    <p>KHUSUS KENDARAAN RODA EMPAT (MOBIL)</p>
                </div>

                <div class="footer-area">
                    <div class="footer-note">
                        <ul>
                            <li>Harap simpan karcis ini dan serahkan kepada petugas saat keluar gerbang.</li>
                            <li>Pastikan Anda telah mengunci kendaraan dengan aman sebelum ditinggalkan.</li>
                        </ul>
                    </div>
                    <div class="signature-area">
                        <p>Penanggung Jawab</p>
                        <div class="signature-space"></div>
                        <p class="signature-name">Ust. Agus Cahyono</p>
                        <p style="font-weight: 300; font-size: 8px;">Ketua Panitia</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

htmlContent += `
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '..', 'karcis-parkir.html'), htmlContent, 'utf8');
console.log('Successfully generated karcis-parkir.html with 150 tickets.');
