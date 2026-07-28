$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

Write-Host "=== PAGE SETUP ==="
Write-Host "PageWidth: $($doc.PageSetup.PageWidth)"
Write-Host "LeftMargin: $($doc.PageSetup.LeftMargin)"
Write-Host "RightMargin: $($doc.PageSetup.RightMargin)"
Write-Host "Body width (points): $($doc.PageSetup.PageWidth - $doc.PageSetup.LeftMargin - $doc.PageSetup.RightMargin)"
Write-Host ""

Write-Host "=== TABLES ==="
$tableIdx = 0
foreach ($table in $doc.Tables) {
    $tableIdx++
    Write-Host "--- Table $tableIdx ---"
    Write-Host "  Text preview: $(($table.Range.Text -replace '\r|\n', ' ').Substring(0, [Math]::Min(80, $table.Range.Text.Length)))"
    Write-Host "  Rows.Alignment: $($table.Rows.Alignment)"
    Write-Host "  Rows.LeftIndent: $($table.Rows.LeftIndent)"
    Write-Host "  Columns.Count: $($table.Columns.Count)"
    $colIdx = 0
    foreach ($col in $table.Columns) {
        $colIdx++
        Write-Host "  Column $($colIdx) Width: $($col.Width)"
    }
    $rowIdx = 0
    foreach ($row in $table.Rows) {
        $rowIdx++
        $cellIdx = 0
        foreach ($cell in $row.Cells) {
            $cellIdx++
            Write-Host "  Row $($rowIdx) Cell $($cellIdx) Width: $($cell.Width)"
            foreach ($p in $cell.Range.Paragraphs) {
                Write-Host "    Para Alignment: $($p.Alignment) RightIndent: $($p.RightIndent) LeftIndent: $($p.LeftIndent) Text: $(($p.Range.Text -replace '\r', '').Substring(0, [Math]::Min(50, $p.Range.Text.Length)))"
            }
        }
    }
}

Write-Host ""
Write-Host "=== NON-TABLE PARAGRAPHS (Arabic/Sig related) ==="
foreach ($p in $doc.Paragraphs) {
    if (-not $p.Range.Information(12)) {
        $text = $p.Range.Text -replace '\r|\n', ''
        if ($p.Alignment -eq 2) {
            Write-Host "  Alignment: $($p.Alignment) RightIndent: $($p.RightIndent) LeftIndent: $($p.LeftIndent) Text: $($text.Substring(0, [Math]::Min(60, $text.Length)))"
        }
    }
}

$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
