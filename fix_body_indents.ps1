Copy-Item -Path "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-PERFECT.docx" -Destination "clean_fixed.docx" -Force

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

$fixedCount = 0
foreach ($p in $doc.Paragraphs) {
    if (-not $p.Range.Information(12)) {
        if ($p.RightIndent -eq 42.5) {
            $p.RightIndent = 0
            $p.LeftIndent = 0
            $fixedCount++
        }
    }
}

Write-Host "Fixed $fixedCount body paragraphs."

$doc.Save()
$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
