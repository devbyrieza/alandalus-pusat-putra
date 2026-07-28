$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

Write-Host "Opening document..."
$docxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
$doc = $word.Documents.Open($docxPath)

Write-Host "Fixing Point 5..."
foreach ($para in $doc.Paragraphs) {
    if ($para.Range.Text -match "tiba di pesantren") {
        Write-Host "Found Point 5."
        $para.Range.Text = "5. Begitu tiba di pesantren, santri dan wali santri langsung menurunkan barang bawaan, kemudian mobil diarahkan ke area parkir.`r"
        $para.Format.LeftIndent = 36
        $para.Format.FirstLineIndent = -36
        break
    }
}

Write-Host "Fixing Signature Block..."
foreach ($para in $doc.Paragraphs) {
    $text = $para.Range.Text
    if ($text -match "Sukabumi|28 Juni|Mudir Pesantren|Wahab Rajasam") {
        Write-Host "Found Signature line."
        $para.Format.Alignment = 2 # Right align
        $para.Format.RightIndent = 0
        $para.Format.LeftIndent = 0
        $para.Format.FirstLineIndent = 0
    }
}

Write-Host "Saving document..."
$doc.Save()

Write-Host "Exporting to PDF..."
$doc.ExportAsFixedFormat("$env:TEMP\Surat_Pemberitahuan_Kedatangan.pdf", 17)

Write-Host "Closing document..."
$doc.Close()
$word.Quit()
Write-Host "Done!"
