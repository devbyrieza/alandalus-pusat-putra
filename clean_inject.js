const fs = require('fs');

const cleanAndInject = (filename) => {
    let content = fs.readFileSync(filename, 'utf8');
    
    // Remove duplicate/old buttons
    content = content.replace(/<button class="btn" id="btn-zip-[\s\S]*?<\/button>/g, '');
    
    // Remove duplicate/old scripts
    content = content.replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/html2canvas[\s\S]*?<\/script>/g, '');
    content = content.replace(/<script>[\s\S]*?downloadSemuaPNG[\s\S]*?<\/script>/g, '');
    
    // Normalize spacing
    content = content.replace(/\n\s*\n/g, '\n');
    
    // Inject the single clean button next to the window.print button
    const btnHtml = `
    <button class="btn" id="btn-zip-${filename.split('.')[0]}" onclick="downloadSemuaPNG()" style="margin-top: 10px; background: #28a745; color: white;">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        DOWNLOAD SEMUA (ZIP PNG)
    </button>`;
    
    content = content.replace('</button>\n    </div>', '</button>\n' + btnHtml + '\n    </div>');
    content = content.replace('</button>\r\n    </div>', '</button>\r\n' + btnHtml + '\r\n    </div>');
    
    // Inject the single clean script before </body>
    const scriptHtml = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script>
async function downloadSemuaPNG() {
    const btn = document.getElementById("btn-zip-${filename.split('.')[0]}");
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
            
            // Render card
            const canvas = await html2canvas(card, { 
                scale: 2, 
                backgroundColor: null,
                logging: false,
                useCORS: true,
                allowTaint: true
            });
            
            card.style.transform = originalTransform;
            card.style.boxShadow = originalShadow;
            
            const dataUrl = canvas.toDataURL("image/png").split(",")[1];
            
            // Try to find the name of the person
            let name = "Kartu_" + (i+1);
            
            // For Panitia
            let nameEl = card.querySelector(".name-container h2");
            // For Santri or fallback
            if (!nameEl) nameEl = card.querySelector(".student-name");
            if (!nameEl) nameEl = card.querySelector("h2");
            if (!nameEl) nameEl = card.querySelector("h3");
            
            if (nameEl) {
                name = nameEl.innerText.trim().replace(/[^a-zA-Z0-9]/g, "_");
            }
            
            zip.file((i+1) + "_" + name + ".png", dataUrl, {base64: true});
            btn.innerHTML = \`Memproses... (\${i+1}/\${cards.length})\`;
        }
        btn.innerHTML = "Menyimpan ZIP...";
        zip.generateAsync({type:"blob"}).then(function(content) {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = "${filename.split('.')[0]}_Siap_Cetak.zip";
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
    content = content.replace('</body>', scriptHtml + '</body>');
    fs.writeFileSync(filename, content);
};

// First let's restore id-card-panitia.html from git to have a clean slate
const { execSync } = require('child_process');
try {
    execSync('git restore id-card-panitia.html');
    console.log('Restored id-card-panitia.html from git');
} catch (e) {
    console.log('Could not restore id-card-panitia.html from git, cleaning manually');
}

cleanAndInject('id-card-panitia.html');
cleanAndInject('id-card-santri.html');
console.log('Re-injected both files successfully!');
