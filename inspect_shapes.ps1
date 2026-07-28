$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx")

Write-Host "--- InlineShapes ---"
foreach ($s in $doc.InlineShapes) {
    Write-Host "Type: $($s.Type), Width: $($s.Width), Height: $($s.Height)"
}

Write-Host "--- Shapes ---"
foreach ($s in $doc.Shapes) {
    Write-Host "Name: $($s.Name), Type: $($s.Type), Width: $($s.Width), Height: $($s.Height)"
}

$doc.Close()
$word.Quit()
