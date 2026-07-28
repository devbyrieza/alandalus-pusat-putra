const fs = require('fs');
let content = fs.readFileSync('scratch/build_karcis.js', 'utf8');
const replacement = `.ticket {
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
        }`;

content = content.replace(/\.ticket \{[\s\S]*?font-weight: 700 !important;\r?\n\s+text-decoration: underline;\r?\n\s+\}/, replacement);
content = content.replace(/font-size: 10px;">Ketua Panitia/, 'font-size: 8px;">Ketua Panitia');

fs.writeFileSync('scratch/build_karcis.js', content, 'utf8');
console.log('Scale adjusted');
