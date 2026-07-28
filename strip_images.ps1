Copy-Item -Path "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-PERFECT.docx" -Destination "clean_fixed.docx" -Force

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

foreach ($p in $doc.Paragraphs) {
    if ($p.Alignment -eq 2 -and $p.RightIndent -eq 0) {
        $p.RightIndent = 42.5
    }
}

# Delete all shapes to prevent text wrapping issues
while ($doc.InlineShapes.Count -gt 0) {
    $doc.InlineShapes.Item(1).Delete()
}
while ($doc.Shapes.Count -gt 0) {
    $doc.Shapes.Item(1).Delete()
}

$doc.Save()
$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
