Copy-Item -Path "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-PERFECT.docx" -Destination "clean_fixed.docx" -Force

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

# 1. Fix Arabic paragraph (not in a table)
foreach ($p in $doc.Paragraphs) {
    if (-not $p.Range.Information(12)) { # wdWithInTable = 12
        if ($p.Alignment -eq 2 -and $p.RightIndent -eq 0) {
            $p.RightIndent = 42.5
        }
    }
}

# 2. Fix the Table containing the signature
foreach ($table in $doc.Tables) {
    $text = $table.Range.Text
    if ($text -match "Ust\. Wahab Rajasam") {
        # Increase the width of all cells in this table by 42.5 so they don't wrap when RightIndent is applied
        foreach ($row in $table.Rows) {
            foreach ($cell in $row.Cells) {
                $cell.Width = $cell.Width + 42.5
            }
        }
        
        # Now apply the 42.5 RightIndent to all paragraphs in the table
        foreach ($p in $table.Range.Paragraphs) {
            $p.RightIndent = 42.5
        }
        Write-Host "Increased cell width and applied RightIndent."
    }
}

$doc.Save()
$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
