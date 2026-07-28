$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

Write-Host "List Paragraphs:"
foreach ($p in $doc.Paragraphs) {
    if (-not $p.Range.Information(12)) {
        $text = $p.Range.Text -replace '\r|\n', ''
        if ($text -match "Foto setengah badan|Fotokopi Kartu Keluarga|Berseragam:") {
            Write-Host "  ListFormat.ListType: $($p.Range.ListFormat.ListType)"
            Write-Host "  LeftIndent: $($p.LeftIndent)"
            Write-Host "  FirstLineIndent: $($p.FirstLineIndent)"
            Write-Host "  TabStops Count: $($p.TabStops.Count)"
            if ($p.TabStops.Count -gt 0) {
                Write-Host "  First TabStop Position: $($p.TabStops.Item(1).Position)"
            }
            Write-Host "  Text: $($text.Substring(0, [Math]::Min(30, $text.Length)))"
            Write-Host "--------------------"
        }
    }
}

$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
