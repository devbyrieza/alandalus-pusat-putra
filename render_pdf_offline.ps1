$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background-color: white; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script type="module">
    import * as pdfjsLib from './pdf.mjs';
    pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';
    
    const urlParams = new URLSearchParams(window.location.search);
    const pageNum = parseInt(urlParams.get('page')) || 1;
    const width = parseInt(urlParams.get('width')) || 1200;
    const height = parseInt(urlParams.get('height')) || 1700;

    pdfjsLib.getDocument('./doc.pdf').promise.then(pdf => {
      return pdf.getPage(pageNum);
    }).then(page => {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      const viewport = page.getViewport({ scale: 1 });
      const scaleX = width / viewport.width;
      const scaleY = height / viewport.height;
      
      canvas.width = width;
      canvas.height = height;

      const renderContext = {
        canvasContext: ctx,
        viewport: page.getViewport({ scale: Math.min(scaleX, scaleY) })
      };

      return page.render(renderContext).promise;
    }).then(() => {
      const script = document.createElement('script');
      script.src = './sleep.js';
      document.body.appendChild(script);
    }).catch(err => {
      console.error("PDFJS ERROR:", err);
      // Append sleep script even on error so it doesn't hang
      const script = document.createElement('script');
      script.src = './sleep.js';
      document.body.appendChild(script);
    });
  </script>
</body>
</html>
"@

$htmlPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\render_pdf_offline.html"
$htmlContent | Out-File -FilePath $htmlPath -Encoding utf8

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outDir = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents"

# Global variable to hold the active PDF path to serve
$script:currentPdfPath = ""

# Start the local server
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:9999/")
$listener.Start()

$job = Start-Job -ScriptBlock {
    param($l, $wsPath)
    try {
        while ($l.IsListening) {
            $context = $l.GetContext()
            $reqPath = $context.Request.Url.AbsolutePath
            
            $res = $context.Response
            
            if ($reqPath -eq "/render.html") {
                $res.ContentType = "text/html"
                $bytes = [System.IO.File]::ReadAllBytes("$wsPath\render_pdf_offline.html")
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
                $res.Close()
            }
            elseif ($reqPath -eq "/pdf.mjs") {
                $res.ContentType = "application/javascript"
                $bytes = [System.IO.File]::ReadAllBytes("$wsPath\node_modules\pdfjs-dist\build\pdf.min.mjs")
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
                $res.Close()
            }
            elseif ($reqPath -eq "/pdf.worker.mjs") {
                $res.ContentType = "application/javascript"
                $bytes = [System.IO.File]::ReadAllBytes("$wsPath\node_modules\pdfjs-dist\build\pdf.worker.min.mjs")
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
                $res.Close()
            }
            elseif ($reqPath -eq "/doc.pdf") {
                $res.ContentType = "application/pdf"
                # Read the current pdf path from file (shared state since jobs are separate processes)
                $pdfPath = [System.IO.File]::ReadAllText("$env:TEMP\current_pdf_path.txt")
                $bytes = [System.IO.File]::ReadAllBytes($pdfPath)
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
                $res.Close()
            }
            elseif ($reqPath -eq "/sleep.js") {
                Start-Sleep -Seconds 3 # Let rendering finish
                $res.ContentType = "application/javascript"
                $bytes = [System.Text.Encoding]::UTF8.GetBytes("// done")
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
                $res.Close()
            }
            else {
                $res.StatusCode = 404
                $res.Close()
            }
        }
    } catch {
        # Catch shutdown
    }
} -ArgumentList $listener, "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam"

# Helper function to render a PDF using the local server
function Render-PdfPageLocal($pdfPath, $page, $width, $height, $outPngPath) {
    # Write the current PDF path to temp file for the job to read
    $pdfPath | Out-File -FilePath "$env:TEMP\current_pdf_path.txt" -NoNewline -Force
    
    if (Test-Path $outPngPath) { Remove-Item $outPngPath -Force }
    
    $targetUrl = "http://localhost:9999/render.html?page=$page&width=$width&height=$height"
    Write-Host "Rendering $pdfPath to $outPngPath..."
    
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
            if ((Get-Item $outPngPath).Length -gt 10000) { # Must be larger than 10KB (empty screenshot is around 8KB)
                break
            }
        }
    }
    
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
    Write-Host "Rendering complete!"
}

try {
    # 1. Render Kop Surat Page 1
    $tempKopPng = "$env:TEMP\temp_kop.png"
    Render-PdfPageLocal "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\CETAK KOP SURAT VERSI 1 DAN 2.pdf" 1 2261 3200 $tempKopPng
    
    # Convert to JPEG for kop-surat-full.jpg
    node convert_kop.js
    
    # 2. Render Rundown Page 1
    $outRundownPng = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\images\welcome-day\rundown.png"
    Render-PdfPageLocal "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\roundown.pdf" 1 1920 1080 $outRundownPng
    
} finally {
    # Shutdown
    $listener.Stop()
    $listener.Close()
    Stop-Job -Job $job
    Remove-Job -Job $job
    if (Test-Path $htmlPath) { Remove-Item $htmlPath -Force }
}
