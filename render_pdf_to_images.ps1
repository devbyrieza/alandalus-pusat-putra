# Start local delay server
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:9999/")
$listener.Start()

$job = Start-Job -ScriptBlock {
    param($l)
    try {
        # Loop to handle up to 5 requests (for multiple renderings)
        for ($i = 0; $i -lt 5; $i++) {
            $context = $l.GetContext()
            Start-Sleep -Seconds 3 # Delay the load event by 3 seconds
            $context.Response.StatusCode = 200
            $context.Response.ContentType = "application/javascript"
            $bytes = [System.Text.Encoding]::UTF8.GetBytes("// done")
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            $context.Response.Close()
        }
    } catch {
        # Ignore errors on cleanup
    }
} -ArgumentList $listener

# Write the HTML renderer
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background-color: white; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script>
    const urlParams = new URLSearchParams(window.location.search);
    const pdfUrl = urlParams.get('pdf');
    const pageNum = parseInt(urlParams.get('page')) || 1;
    const width = parseInt(urlParams.get('width')) || 1200;
    const height = parseInt(urlParams.get('height')) || 1700;

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
      return pdf.getPage(pageNum);
    }).then(page => {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      const viewport = page.getViewport({ scale: 1 });
      const scaleX = width / viewport.width;
      const scaleY = height / viewport.height;
      
      // Use the exact window dimensions
      canvas.width = width;
      canvas.height = height;

      const renderContext = {
        canvasContext: ctx,
        viewport: page.getViewport({ scale: Math.min(scaleX, scaleY) })
      };

      return page.render(renderContext).promise;
    }).then(() => {
      // Append the slow script to block the load event
      const script = document.createElement('script');
      script.src = 'http://localhost:9999/sleep.js';
      document.body.appendChild(script);
    });
  </script>
</body>
</html>
"@

$htmlPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\render_pdf.html"
$htmlContent | Out-File -FilePath $htmlPath -Encoding utf8

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# Function to render a PDF page to PNG
function Render-PdfPage($pdfRelativePath, $page, $width, $height, $outPngPath) {
    # Convert backslashes to forward slashes for URL
    $pdfUrl = "file:///C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/" + $pdfRelativePath.Replace("\", "/")
    $targetUrl = "file:///$($htmlPath.Replace("\", "/"))?pdf=$pdfUrl&page=$page&width=$width&height=$height"
    
    Write-Host "Rendering $pdfRelativePath (Page $page) to $outPngPath..."
    
    $proc = Start-Process -FilePath $edgePath -ArgumentList @(
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--screenshot=$outPngPath",
        "--window-size=$width,$height",
        $targetUrl
    ) -PassThru
    
    # Wait for screenshot to be written (up to 15 seconds)
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Milliseconds 500
        if (Test-Path $outPngPath) {
            # Check if file is completely written (size > 0)
            if ((Get-Item $outPngPath).Length -gt 0) {
                break
            }
        }
    }
    
    # Kill the Edge process to clean up
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    Write-Host "Done rendering!"
}

try {
    # 1. Render Kop Surat Page 1 -> kop-surat-full.png
    $tempKopPng = "$env:TEMP\temp_kop.png"
    if (Test-Path $tempKopPng) { Remove-Item $tempKopPng -Force }
    Render-PdfPage "public\documents\CETAK KOP SURAT VERSI 1 DAN 2.pdf" 1 2261 3200 $tempKopPng
    
    # Convert PNG to JPEG for kop-surat-full.jpg using node-sharp (pre-installed and working!)
    $sharpScript = @"
const sharp = require('sharp');
sharp('$($tempKopPng.Replace("\", "\\"))')
  .jpeg({ quality: 95 })
  .toFile('C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/public/images/kop-surat-full.jpg')
  .then(() => console.log('Successfully saved kop-surat-full.jpg'))
  .catch(err => console.error(err));
"@
    $sharpScriptPath = "$env:TEMP\convert_kop.js"
    $sharpScript | Out-File -FilePath $sharpScriptPath -Encoding utf8
    node $sharpScriptPath
    
    # 2. Render Rundown Page 1 -> public/images/welcome-day/rundown.png
    $outRundownPng = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\images\welcome-day\rundown.png"
    if (Test-Path $outRundownPng) { Remove-Item $outRundownPng -Force }
    Render-PdfPage "public\documents\roundown.pdf" 1 1920 1080 $outRundownPng
    
} finally {
    # Cleanup
    $listener.Stop()
    $listener.Close()
    Stop-Job -Job $job
    Remove-Job -Job $job
    if (Test-Path $htmlPath) { Remove-Item $htmlPath -Force }
}
