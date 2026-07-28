$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx")

$inSectionB = $false
foreach ($para in $doc.Paragraphs) {
    $text = $para.Range.Text.Trim()
    if ($text -match "Tata Cara dan Alur Kegiatan") {
        $inSectionB = $true
    }
    if ($inSectionB) {
        Write-Host $text
        if ($text -match "Orang tua hanya diperkenankan") {
            break
        }
    }
}

$doc.Close()
$word.Quit()
