$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

$docxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
$doc = $word.Documents.Open($docxPath)

foreach ($para in $doc.Paragraphs) {
    if ($para.Range.Text -match "tiba di pesantren") {
        $para.Range.Text = "5. Begitu tiba di pesantren, santri dan wali santri langsung menurunkan barang bawaan, kemudian mobil diarahkan ke area parkir.`r"
        $para.Format.LeftIndent = 36
        $para.Format.FirstLineIndent = -36
        $para.Format.TabStops.ClearAll()
        $para.Format.TabStops.Add(36)
        $para.Format.Alignment = 3 # Justify
    }
}

foreach ($para in $doc.Paragraphs) {
    $text = $para.Range.Text
    if ($text -match "Sukabumi" -or $text -match "28 Juni" -or $text -match "Mudir Pesantren" -or $text -match "Wahab Rajasam") {
        $para.Format.Alignment = 2 # Right align
        $para.Format.RightIndent = 0
    }
}

$doc.Save()

# Delete existing temp PDF to avoid prompts
$tempPdf = "$env:TEMP\Surat_Pemberitahuan_Kedatangan.pdf"
if (Test-Path $tempPdf) { Remove-Item $tempPdf -Force -ErrorAction SilentlyContinue }

$doc.ExportAsFixedFormat($tempPdf, 17)
$doc.Close()
$word.Quit()
