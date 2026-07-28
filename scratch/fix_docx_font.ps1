$word = New-Object -ComObject Word.Application
$word.Visible = $false

$files = @(
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx",
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\file dari media\003-Surat Undangan Welcome Day Pesantren Al Imam Al Islami.docx"
)

$pdf_outputs = @(
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Surat_Pemberitahuan_Kedatangan.pdf",
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Surat_Undangan_Welcome_Day.pdf"
)

$pdf_outputs_ulul = @(
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-ululalbaab\public\documents\Surat_Pemberitahuan_Kedatangan.pdf",
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-ululalbaab\public\documents\Surat_Undangan_Welcome_Day.pdf"
)

for ($i = 0; $i -lt $files.Length; $i++) {
    $doc = $word.Documents.Open($files[$i])
    
    # Change Font
    $doc.Content.Font.Name = "Arial"
    
    # Shrink font to fit better
    $doc.Content.Select()
    $word.Selection.Font.Shrink()
    
    # Delete trailing empty paragraphs
    $paras = $doc.Paragraphs
    for ($p = $paras.Count; $p -ge 1; $p--) {
        $text = $paras.Item($p).Range.Text.Trim()
        if ($text -eq "" -or $text -eq "" -or $text -eq "
") {
            $paras.Item($p).Range.Delete()
        } else {
            break
        }
    }
    
    $doc.Save()
    $doc.ExportAsFixedFormat($pdf_outputs[$i], 17)
    $doc.ExportAsFixedFormat($pdf_outputs_ulul[$i], 17)
    $doc.Close()
}

$word.Quit()
