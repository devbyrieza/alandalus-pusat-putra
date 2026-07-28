$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    # Convert AIIS-Surat-Kesehatan-PSB-26-27-REVISED (1).docx to PDF
    $docx = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\AIIS-Surat-Kesehatan-PSB-26-27-REVISED (1).docx"
    $tempPdf = "$env:TEMP\test_kesehatan.pdf"
    
    if (Test-Path $docx) {
        $doc = $word.Documents.Open($docx)
        $doc.ExportAsFixedFormat($tempPdf, 17)
        $doc.Close()
        
        $originalSize = (Get-Item "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Contoh_SuratKesehatan.pdf").Length
        $newSize = (Get-Item $tempPdf).Length
        
        Write-Host "Original Contoh_SuratKesehatan.pdf size: $originalSize bytes"
        Write-Host "Generated PDF size: $newSize bytes"
    } else {
        Write-Host "DOCX not found"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $word.Quit()
}
