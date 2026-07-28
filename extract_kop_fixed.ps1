# Disable the PDF conversion warning dialog in Word
$registryPath = "HKCU:\Software\Microsoft\Office\16.0\Word\Options"
if (-not (Test-Path $registryPath)) {
    New-Item -Path $registryPath -Force | Out-Null
}
New-ItemProperty -Path $registryPath -Name "DisablePDFCNVMessage" -Value 1 -PropertyType DWORD -Force | Out-Null

Write-Host "Registry key set!"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $pdfPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\CETAK KOP SURAT VERSI 1 DAN 2.pdf"
    $docxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\kop_temp.docx"
    
    if (Test-Path $docxPath) { Remove-Item $docxPath -Force }
    
    Write-Host "Opening PDF in Word..."
    $doc = $word.Documents.Open($pdfPath, $false, $true) # ConfirmConversions=False, ReadOnly=True
    
    Write-Host "Saving as DOCX..."
    $doc.SaveAs($docxPath, 16) # wdFormatDocumentDefault
    $doc.Close()
    
    Write-Host "PDF converted successfully!"
    
    # Unzip
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $tempDir = "$env:TEMP\kop_media_extract_v2"
    if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
    [System.IO.Compression.ZipFile]::ExtractToDirectory($docxPath, $tempDir)
    
    $mediaDir = "$tempDir\word\media"
    if (Test-Path $mediaDir) {
        Get-ChildItem $mediaDir | ForEach-Object {
            Write-Host "Found image: $($_.Name) - $($_.Length) bytes"
        }
    } else {
        Write-Host "No media found in converted DOCX"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $word.Quit()
}
