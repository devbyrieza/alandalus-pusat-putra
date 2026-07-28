$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')
$find = $doc.Content.Find
$find.Execute("Tempat `t:", $false, $false, $false, $false, $false, $true, 1, $false, "Tempat `t`t:", 2)
$doc.Save()
$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Host "Fixed tab stops in DOCX!"
