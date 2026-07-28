$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

foreach ($shape in $doc.InlineShapes) {
    Write-Host "InlineShape found."
    $s = $shape.ConvertToShape()
    $s.WrapFormat.Type = 3 # wdWrapNone (Behind text)
    $s.ZOrder(5) # Send behind text
    Write-Host "Converted InlineShape to floating and sent behind text."
}

foreach ($shape in $doc.Shapes) {
    Write-Host "Shape found with WrapType: $($shape.WrapFormat.Type)"
    $shape.WrapFormat.Type = 3 # Behind text
    $shape.ZOrder(5) # Send behind text
    Write-Host "Set Shape to Behind Text."
}

$doc.Save()
$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
