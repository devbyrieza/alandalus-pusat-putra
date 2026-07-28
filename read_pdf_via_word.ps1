$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $pdfPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\roundown.pdf"
    # Format=24 is wdOpenFormatPDF
    $doc = $word.Documents.Open($pdfPath, $false, $true, $false, "", "", $false, "", "", 24)
    
    Write-Host "=== WORD CONVERTED TEXT ==="
    Write-Host $doc.Content.Text
    
    $doc.Close()
} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $word.Quit()
}
