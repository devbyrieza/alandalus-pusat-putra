$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $pdfPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\CETAK KOP SURAT VERSI 1 DAN 2.pdf"
    $docxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\kop_temp.docx"
    
    if (Test-Path $docxPath) { Remove-Item $docxPath -Force }
    
    # Open PDF in Word (Word will convert it)
    $doc = $word.Documents.Open($pdfPath)
    $doc.SaveAs($docxPath, 16) # wdFormatDocumentDefault (docx)
    $doc.Close()
    
    Write-Host "PDF converted to DOCX successfully!"
    
    # Unzip docx to see media
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $tempDir = "$env:TEMP\kop_media_extract"
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
