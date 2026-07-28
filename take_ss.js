const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 1000, deviceScaleFactor: 2 });
        
        // Open the local file directly
        await page.goto('file://' + __dirname.replace(/\\/g, '/') + '/public/mosa_cup.html', { waitUntil: 'networkidle0' });
        
        // Hide the absensi section
        await page.evaluate(() => {
            const absensi = document.querySelector('section.pb-12'); // This is the absensi section
            if (absensi) absensi.style.display = 'none';
            
            // Hide the header buttons just to make it cleaner
            const modeBadge = document.getElementById('mode-badge');
            const adminBtn = document.getElementById('admin-toggle-btn');
            if (modeBadge) modeBadge.style.display = 'none';
            if (adminBtn) adminBtn.style.display = 'none';
        });
        
        // Wait a bit for lucide icons to render
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Take full page screenshot
        await page.screenshot({ path: 'mosa_cup_wa_poster_safe.jpg', type: 'jpeg', quality: 90, fullPage: true });
        
        await browser.close();
        console.log('Screenshot saved to mosa_cup_wa_poster_safe.jpg');
    } catch (err) {
        console.error(err);
    }
})();
