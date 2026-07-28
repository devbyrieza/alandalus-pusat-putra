$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

foreach ($p in $doc.Paragraphs) {
    # If the paragraph is right-aligned (Alignment = 2) and is on the first page, 
    # we should set its RightIndent to 42.5 to match the body paragraphs!
    # Let's just check if it's right-aligned and RightIndent is 0.
    if ($p.Alignment -eq 2 -and $p.RightIndent -eq 0) {
        $p.RightIndent = 42.5
        Write-Host "Fixed RightIndent for: $($p.Range.Text.Trim())"
    }
}

$doc.Save()
$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
