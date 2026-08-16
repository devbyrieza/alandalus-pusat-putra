const puppeteer = require('puppeteer-core');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');
const path = require('path');

(async () => {
    try {
        console.log('Membuka browser chrome untuk merekam...');
        const browser = await puppeteer.launch({ 
            headless: 'new',
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            defaultViewport: { width: 1920, height: 1080 }
        });
        
        const page = await browser.newPage();
        
        const htmlPath = 'file:///' + path.resolve(__dirname, '../../slide-santri-welcome-day.html').replace(/\\/g, '/');
        console.log('Memuat file HTML: ' + htmlPath);
        
        await page.goto(htmlPath, { waitUntil: 'networkidle0' });
        
        const recorder = new PuppeteerScreenRecorder(page, {
            fps: 30,
            videoFrame: { width: 1920, height: 1080 }
        });
        
        const savePath = path.resolve(__dirname, 'slide-welcome-day.mp4');
        console.log('Memulai perekaman MP4 (harap tunggu sekitar 3-4 menit)...');
        await recorder.start(savePath);
        
        // Simulasikan menekan tombol spasi untuk memulai play
        await page.keyboard.press('Space');
        
        // Tunggu hingga semua slide selesai.
        // Asumsi: 36 slide * 5 detik = 180 detik. Kita set 185 detik untuk aman.
        await new Promise(r => setTimeout(r, 185000));
        
        await recorder.stop();
        await browser.close();
        
        console.log('Selesai! Video berhasil disimpan di: ' + savePath);
    } catch (e) {
        console.error('Terjadi kesalahan:', e);
    }
})();
