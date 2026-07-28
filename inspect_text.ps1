$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

foreach ($p in $doc.Paragraphs) {
    if ($p.Range.Text -match "Ust\. Wahab Rajasam") {
        $chars = $p.Range.Characters
        Write-Host "Length: $($chars.Count)"
        for ($i = 1; $i -le $chars.Count; $i++) {
            $c = $chars.Item($i).Text
            $code = [int][char]$c[0]
            Write-Host "Char $($i): '$c' (Code: $code)"
        }
        
        Write-Host "RightIndent: $($p.RightIndent)"
        Write-Host "LeftIndent: $($p.LeftIndent)"
        Write-Host "Alignment: $($p.Alignment)"
    }
}

$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
