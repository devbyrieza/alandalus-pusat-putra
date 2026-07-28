Copy-Item -Path "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-PERFECT.docx" -Destination "clean_fixed.docx" -Force

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

# Re-apply the body paragraph fix
foreach ($p in $doc.Paragraphs) {
    if (-not $p.Range.Information(12)) {
        if ($p.RightIndent -eq 42.5) {
            $p.RightIndent = 0
            $p.LeftIndent = 0
        }
    }
}

# Fix the subtitle alignment
foreach ($p in $doc.Paragraphs) {
    $text = $p.Range.Text -replace '\r|\n', ''
    if ($text -match "Sabtu, 18 Juli 2026 \| Pesantren Al Imam Al Islami") {
        $p.Alignment = 1
        $p.LeftIndent = 0
        $p.FirstLineIndent = 0
    }
}

# Fix the list spacing
$fixedLists = 0
foreach ($p in $doc.Paragraphs) {
    if (-not $p.Range.Information(12)) {
        if ([Math]::Round($p.LeftIndent, 1) -eq 36.0 -and [Math]::Round($p.FirstLineIndent, 1) -eq -36.0) {
            $p.LeftIndent = 24
            $p.FirstLineIndent = -24
            
            # Clear all tab stops and set one at 24
            $p.TabStops.ClearAll()
            $p.TabStops.Add(24) | Out-Null
            
            $fixedLists++
        }
    }
}

Write-Host "Fixed $fixedLists list items to reduce the gap."

$doc.Save()
$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
