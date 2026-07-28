const fs = require('fs');
const inject = (filename) => {
    let content = fs.readFileSync(filename, 'utf8');
    
    // Replace downloadSemuaPNG function with one that has try-catch
    const newScriptHtml = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script>
async function downloadSemuaPNG() {
    const btn = document.querySelector('[id^="btn-zip-"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = "Memproses... Mohon tunggu (0%)";
    const cards = document.querySelectorAll(".id-card");
    const zip = new JSZip();
    
    try {
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const originalTransform = card.style.transform;
            const originalShadow = card.style.boxShadow;
            card.style.transform = "none";
            card.style.boxShadow = "none";
            
            // Try scaling down to 2 instead of 3 to avoid memory issues
            const canvas = await html2canvas(card, { 
                scale: 2, 
                backgroundColor: null,
                logging: true,
                useCORS: true,
                allowTaint: true
            });
            
            card.style.transform = originalTransform;
            card.style.boxShadow = originalShadow;
            
            const dataUrl = canvas.toDataURL("image/png").split(",")[1];
            let name = "Kartu_" + (i+1);
            const nameEl = card.querySelector("h2");
            if (nameEl) name = nameEl.innerText.trim().replace(/[^a-zA-Z0-9]/g, "_");
            zip.file(name + ".png", dataUrl, {base64: true});
            btn.innerHTML = \`Memproses... (\${i+1}/\${cards.length})\`;
        }
        btn.innerHTML = "Menyimpan ZIP...";
        zip.generateAsync({type:"blob"}).then(function(content) {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = "ID_Cards_Siap_Cetak.zip";
            link.click();
            btn.innerHTML = "Download Selesai!";
            setTimeout(() => btn.innerHTML = originalText, 3000);
        });
    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan: " + err.message + "\\n\\nBuka Console (F12) untuk detail.");
        btn.innerHTML = originalText;
    }
}
</script>
`;

    // Remove old script block first
    content = content.replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/html2canvas[\s\S]*?<\/script>/, '');
    
    // Inject new one before </body>
    content = content.replace('</body>', newScriptHtml + '</body>');
    fs.writeFileSync(filename, content);
};
inject('id-card-panitia.html');
inject('id-card-santri.html');
console.log('Injection with try-catch successful!');
