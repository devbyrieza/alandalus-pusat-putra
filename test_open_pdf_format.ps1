$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

$pdfPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\CETAK KOP SURAT VERSI 1 DAN 2.pdf"
$docxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\kop_temp.docx"

if (Test-Path $docxPath) { Remove-Item $docxPath -Force }

try {
    Write-Host "Opening PDF with Format=24 (wdOpenFormatPDF)..."
    $startTime = Get-Date
    
    # Open(FileName, ConfirmConversions, ReadOnly, AddToRecentFiles, PasswordDocument, PasswordTemplate, Revert, WritePasswordDocument, WritePasswordTemplate, Format)
    # Format = 24 (wdOpenFormatPDF)
    $doc = $word.Documents.Open($pdfPath, $false, $true, $false, [Type]::Missing, [Type]::Missing, $true, [Type]::Missing, [Type]::Missing, 24)
    
    $elapsed = (Get-Date) - $startTime
    Write-Host "Success! Opened in $($elapsed.TotalSeconds) seconds"
    
    $doc.SaveAs($docxPath, 16)
    $doc.Close()
    Write-Host "Saved to $docxPath"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $word.Quit()
}
