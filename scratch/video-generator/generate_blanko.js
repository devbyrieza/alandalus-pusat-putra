const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
    try {
        console.log('Membuka browser untuk membuat blanko...');
        const browser = await puppeteer.launch({ 
            headless: 'new',
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            defaultViewport: { width: 2000, height: 2000, deviceScaleFactor: 4 } // 4x scale for high print quality
        });
        
        const page = await browser.newPage();
        const htmlPath = 'file:///' + path.resolve(__dirname, '../../01_Template_Kartu_AlImam.html').replace(/\\/g, '/');
        await page.goto(htmlPath, { waitUntil: 'networkidle0' });
        
        // Hide all dynamic content to create a clean master background
        await page.addStyleTag({content: `
            .photo-box img, 
            .qr-box img,
            .student-info { 
                display: none !important; 
                opacity: 0 !important;
                visibility: hidden !important;
            }
        `});
        
        // Let's find the cards
        const cards = await page.$$('.id-card');
        
        if (cards.length >= 2) {
            const outDir = path.resolve(__dirname, '../../Kirim_ke_PT_TKI/Master_Blanko_Resolusi_Tinggi');
            if (!fs.existsSync(outDir)) {
                fs.mkdirSync(outDir, { recursive: true });
            }
            
            // Front Card
            await cards[0].screenshot({
                path: path.join(outDir, 'BLANKO_DEPAN_HIGHRES.png'),
                type: 'png',
                omitBackground: true
            });
            console.log('Blanko Depan berhasil dibuat.');
            
            // Back Card
            await cards[1].screenshot({
                path: path.join(outDir, 'BLANKO_BELAKANG_HIGHRES.png'),
                type: 'png',
                omitBackground: true
            });
            console.log('Blanko Belakang berhasil dibuat.');
            
            console.log('Semua Blanko berhasil diekspor ke folder Kirim_ke_PT_TKI/Master_Blanko_Resolusi_Tinggi');
        } else {
            console.log('Gagal menemukan elemen .id-card');
        }
        
        await browser.close();
    } catch (e) {
        console.error('Error:', e);
    }
})();
