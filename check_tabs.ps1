$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')
$paras = $doc.Paragraphs
foreach($p in $paras) {
    if($p.Range.Text -match 'Tempat') {
        $text = $p.Range.Text
        $text = $text -replace "`t", "[TAB]"
        $text = $text -replace " ", "[SPACE]"
        Write-Host "---"
        Write-Host $text
    }
}
$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
