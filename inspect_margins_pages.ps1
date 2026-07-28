$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

Write-Host "Page 1 - Body Paragraphs:"
foreach ($p in $doc.Paragraphs) {
    if (-not $p.Range.Information(12)) {
        $text = $p.Range.Text -replace '\r|\n', ''
        if ($text -match "Alhamdulillah|Sehubungan dengan akan dimulainya|Demikian atas perhatian") {
            Write-Host "  Alignment: $($p.Alignment) LeftIndent: $($p.LeftIndent) RightIndent: $($p.RightIndent) FirstLineIndent: $($p.FirstLineIndent) Text: $($text.Substring(0, [Math]::Min(30, $text.Length)))"
        }
    }
}

Write-Host "`nPage 2 - Requirements & Rundown:"
foreach ($p in $doc.Paragraphs) {
    if (-not $p.Range.Information(12)) {
        $text = $p.Range.Text -replace '\r|\n', ''
        if ($text -match "A\. Berkas Persyaratan|Seluruh berkas|1\. Foto setengah|B\. Tata Cara|1\. Berseragam") {
            Write-Host "  Alignment: $($p.Alignment) LeftIndent: $($p.LeftIndent) RightIndent: $($p.RightIndent) FirstLineIndent: $($p.FirstLineIndent) Text: $($text.Substring(0, [Math]::Min(30, $text.Length)))"
        }
    }
}

$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
