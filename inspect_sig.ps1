$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx")

foreach ($para in $doc.Paragraphs) {
    $text = $para.Range.Text.Trim()
    if ($text -match "Sukabumi" -or $text -match "Mudir Pesantren" -or $text -match "Wahab") {
        Write-Host "Text: $text"
        Write-Host "Alignment: $($para.Format.Alignment)"
        Write-Host "LeftIndent: $($para.Format.LeftIndent)"
        Write-Host "FirstLineIndent: $($para.Format.FirstLineIndent)"
        Write-Host "--------------------"
    }
}
$doc.Close()
$word.Quit()
