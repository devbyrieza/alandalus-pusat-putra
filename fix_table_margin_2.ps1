Copy-Item -Path "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-PERFECT.docx" -Destination "clean_fixed.docx" -Force

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

foreach ($p in $doc.Paragraphs) {
    if (-not $p.Range.Information(12)) {
        if ($p.Alignment -eq 2 -and $p.RightIndent -eq 0) {
            $p.RightIndent = 42.5
        }
    }
}

foreach ($table in $doc.Tables) {
    $text = $table.Range.Text
    if ($text -match "Ust\. Wahab Rajasam") {
        # Target right edge: 503.27
        # Cell width: 184.25
        # Target absolute left: 319.02
        # Page Left Margin is usually 49.55 or similar (1.75 cm? Actually 49.55 is ~1.75cm)
        $leftMargin = $doc.PageSetup.LeftMargin
        $leftIndent = 319.02 - $leftMargin
        
        $table.Rows.Alignment = 0
        $table.Rows.LeftIndent = $leftIndent
        Write-Host "Set Table LeftIndent to $leftIndent (LeftMargin: $leftMargin)"
    }
}

$doc.Save()
$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
