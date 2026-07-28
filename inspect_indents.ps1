$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

Write-Host "Page Setup Right Margin: $($doc.PageSetup.RightMargin)"

foreach ($p in $doc.Paragraphs) {
    $text = $p.Range.Text.Trim()
    if ($text.Length -gt 10) {
        $preview = $text.Substring(0, [math]::Min(30, $text.Length))
        Write-Host "Para: '$preview' | RightIndent: $($p.RightIndent) | Alignment: $($p.Alignment) | LeftIndent: $($p.LeftIndent)"
    }
}

$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
