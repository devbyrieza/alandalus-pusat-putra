Copy-Item -Path "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-PERFECT.docx" -Destination "clean_fixed.docx" -Force

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

# ONLY fix the Arabic paragraphs OUTSIDE the table
# The table and its contents must NOT be touched
$fixedCount = 0
foreach ($p in $doc.Paragraphs) {
    # Skip if inside a table
    if ($p.Range.Information(12)) { continue }
    
    # Only target Arabic (RTL) centered paragraphs with zero RightIndent
    if ($p.Alignment -eq 2 -and $p.RightIndent -eq 0) {
        $text = $p.Range.Text
        # Only fix bismillah and wassalam lines (they are RTL Arabic)
        # Check that the paragraph contains Arabic characters (code > 1000)
        $hasArabic = $false
        foreach ($c in $p.Range.Characters) {
            if ([int][char]$c.Text[0] -gt 1000) {
                $hasArabic = $true
                break
            }
        }
        if ($hasArabic) {
            $p.RightIndent = 42.5
            $fixedCount++
            Write-Host "Fixed Arabic para: $(($text -replace '\r','').Substring(0, [Math]::Min(40, $text.Length)))"
        }
    }
}

Write-Host "Total fixed: $fixedCount"

$doc.Save()
$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
