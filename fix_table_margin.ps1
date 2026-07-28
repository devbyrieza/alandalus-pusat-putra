Copy-Item -Path "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-PERFECT.docx" -Destination "clean_fixed.docx" -Force

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

# 1. Fix Arabic paragraph (not in a table)
foreach ($p in $doc.Paragraphs) {
    if (-not $p.Range.Information(12)) { # Not in table
        if ($p.Alignment -eq 2 -and $p.RightIndent -eq 0) {
            $p.RightIndent = 42.5
        }
    }
}

# 2. Fix the Table that contains the signature
foreach ($table in $doc.Tables) {
    # If the table is on the right side
    $text = $table.Range.Text
    if ($text -match "Ust\. Wahab Rajasam") {
        # Instead of shrinking the cell by setting RightIndent on the paragraph,
        # we move the table itself!
        # Set table alignment to Right, and then we can't easily add a right margin.
        # But we can change the alignment to wdAlignRowLeft and specify an explicit LeftIndent!
        # If Page = 595, RightMargin = 49.55, BodyRightIndent = 42.5.
        # Target right edge = 595 - 49.55 - 42.5 = 502.95
        # Cell Width = 184.25
        # Target Left Edge = 502.95 - 184.25 = 318.7
        $table.Rows.Alignment = 0 # wdAlignRowLeft
        $table.Rows.LeftIndent = 318.7
        Write-Host "Shifted the table!"
    }
}

$doc.Save()
$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
