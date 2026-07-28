$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

Write-Host "Checking all indented paragraphs on page 2:"
foreach ($p in $doc.Paragraphs) {
    if (-not $p.Range.Information(12)) {
        if ($p.LeftIndent -gt 0 -and $p.FirstLineIndent -lt 0) {
            $text = $p.Range.Text -replace '\r|\n', ''
            Write-Host "LeftIndent: $($p.LeftIndent), FirstLine: $($p.FirstLineIndent), Text: $($text.Substring(0, [Math]::Min(30, $text.Length)))"
        }
    }
}

$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
