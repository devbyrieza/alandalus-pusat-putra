$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

foreach ($p in $doc.Paragraphs) {
    if ($p.Range.Text -match "Ust\. Wahab Rajasam") {
        Write-Host "FirstLineIndent: $($p.FirstLineIndent)"
        Write-Host "LeftIndent: $($p.LeftIndent)"
        Write-Host "RightIndent: $($p.RightIndent)"
    }
}

$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
