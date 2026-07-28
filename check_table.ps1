$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

foreach ($p in $doc.Paragraphs) {
    if ($p.Range.Text -match "Ust\. Wahab Rajasam") {
        Write-Host "InTable: $($p.Range.Information(12))" # wdWithInTable = 12
        if ($p.Range.Information(12)) {
            $cell = $p.Range.Cells.Item(1)
            Write-Host "Cell Width: $($cell.Width)"
        }
    }
}

$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
