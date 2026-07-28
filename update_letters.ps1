Add-Type -AssemblyName System.IO.Compression.FileSystem

# Workspaces list
$workspaces = @(
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam",
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-ululalbaab",
    "C:\Users\itpua\Dev\Work\al-andalus\template-demo"
)

# Source files
$stempelSrc = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Stempel 1.png"
$kopSrc = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\images\kop-surat-full.jpg"
$rundownSrc = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\roundown.pdf"
$letterheadsSrc = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\CETAK KOP SURAT VERSI 1 DAN 2.pdf"

# 1. Update 04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx
Write-Host "Updating 04-Surat Pemberitahuan...docx..."
$docx1 = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
$tempDir1 = "$env:TEMP\docx_update_1"
if (Test-Path $tempDir1) { Remove-Item $tempDir1 -Recurse -Force }
[System.IO.Compression.ZipFile]::ExtractToDirectory($docx1, $tempDir1)

# Copy Stempel 1.png -> image2.png
Copy-Item $stempelSrc -Destination "$tempDir1\word\media\image2.png" -Force
# Copy kop-surat-full.jpg -> image4.jpg
Copy-Item $kopSrc -Destination "$tempDir1\word\media\image4.jpg" -Force

# Re-zip
Remove-Item $docx1 -Force
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir1, $docx1)
Remove-Item $tempDir1 -Recurse -Force
Write-Host "04-Surat Pemberitahuan...docx updated!"

# 2. Update 003-Surat Undangan Welcome Day Pesantren Al Imam Al Islami.docx
Write-Host "Updating 003-Surat Undangan...docx..."
$docx2 = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\file dari media\003-Surat Undangan Welcome Day Pesantren Al Imam Al Islami.docx"
$tempDir2 = "$env:TEMP\docx_update_2"
if (Test-Path $tempDir2) { Remove-Item $tempDir2 -Recurse -Force }
[System.IO.Compression.ZipFile]::ExtractToDirectory($docx2, $tempDir2)

# Copy kop-surat-full.jpg -> image3.jpeg
Copy-Item $kopSrc -Destination "$tempDir2\word\media\image3.jpeg" -Force

# Re-zip
Remove-Item $docx2 -Force
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir2, $docx2)
Remove-Item $tempDir2 -Recurse -Force
Write-Host "003-Surat Undangan...docx updated!"

# 3. Convert DOCX to PDF using Word COM
Write-Host "Converting DOCX files to PDF..."
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

$pdfOut1 = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Surat Pemberitahuan Kedatangan Santri Baru 2026-2027.pdf"
$pdfOut2 = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Surat_Undangan_Welcome_Day.pdf"

try {
    # Convert Letter 1
    $doc = $word.Documents.Open($docx1)
    $doc.ExportAsFixedFormat($pdfOut1, 17) # 17 is wdExportFormatPDF
    $doc.Close()
    Write-Host "Letter 1 converted successfully!"

    # Convert Letter 2
    $doc = $word.Documents.Open($docx2)
    $doc.ExportAsFixedFormat($pdfOut2, 17)
    $doc.Close()
    Write-Host "Letter 2 converted successfully!"
} catch {
    Write-Host "Error during PDF conversion: $($_.Exception.Message)"
} finally {
    $word.Quit()
}

# 4. Copy files to other workspaces
Write-Host "Syncing files across workspaces..."
foreach ($ws in $workspaces) {
    $docDir = "$ws\public\documents"
    if (!(Test-Path $docDir)) { New-Item -ItemType Directory -Path $docDir -Force | Out-Null }
    
    # Copy PDF letters
    Copy-Item $pdfOut1 -Destination "$docDir\Surat Pemberitahuan Kedatangan Santri Baru 2026-2027.pdf" -Force
    Copy-Item $pdfOut2 -Destination "$docDir\Surat_Undangan_Welcome_Day.pdf" -Force
    
    # Copy rundown and stamp
    Copy-Item $rundownSrc -Destination "$docDir\roundown.pdf" -Force
    Copy-Item $stempelSrc -Destination "$docDir\Stempel 1.png" -Force
    Copy-Item $letterheadsSrc -Destination "$docDir\CETAK KOP SURAT VERSI 1 DAN 2.pdf" -Force
    
    # Copy DOCX source files
    Copy-Item $docx1 -Destination "$ws\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx" -Force
    
    # For alandalus-ululalbaab and template-demo, they might have their own invitation letter source, but let's copy the compiled PDFs anyway!
}

# 5. Clean up old PDFs & docx files in alandalus-alimam/public/documents
Write-Host "Cleaning up old files..."
$oldPdf = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Surat_Pemberitahuan_Kedatangan.pdf"
$oldDocx = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Surat_Pemberitahuan_Kedatangan.pdf.docx"

if (Test-Path $oldPdf) { Remove-Item $oldPdf -Force }
if (Test-Path $oldDocx) { Remove-Item $oldDocx -Force }

Write-Host "All update and sync steps completed successfully!"
