$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx")

Write-Host "--- PARAGRAPH DUMP ---"
$i = 1
foreach ($para in $doc.Paragraphs) {
    $text = $para.Range.Text.Trim()
    if ($text.Length -gt 0) {
        $leftIndent = $para.Format.LeftIndent
        $firstLineIndent = $para.Format.FirstLineIndent
        $tabCount = $para.Format.TabStops.Count
        Write-Host "[$i] L:$leftIndent F:$firstLineIndent T:$tabCount - $($text.Substring(0, [math]::Min($text.Length, 50)))"
    }
    $i++
}

$doc.Close()
$word.Quit()
