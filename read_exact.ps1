$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx")

Write-Host "--- Point 5 ---"
foreach ($para in $doc.Paragraphs) {
    if ($para.Range.Text -match "tiba di pesantren") {
        Write-Host "FOUND: '$($para.Range.Text)'"
    }
}

Write-Host "--- Signature Block ---"
foreach ($para in $doc.Paragraphs) {
    if ($para.Range.Text -match "Sukabumi|28 Juni|Mudir Pesantren") {
        Write-Host "FOUND: '$($para.Range.Text)'"
    }
}

$doc.Close()
$word.Quit()
