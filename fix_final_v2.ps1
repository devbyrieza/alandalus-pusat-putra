$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

$docxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
$doc = $word.Documents.Open($docxPath)

# Fix Point 5 in Section B
foreach ($para in $doc.Paragraphs) {
    $text = $para.Range.Text
    if ($text -match "tiba di pesantren") {
        $para.Range.Text = "5. Begitu tiba di pesantren, santri dan wali santri langsung menurunkan barang bawaan, kemudian mobil diarahkan ke area parkir.`r"
        $para.Format.LeftIndent = 36
        $para.Format.FirstLineIndent = -36
        $para.Format.TabStops.ClearAll()
        $para.Format.TabStops.Add(36)
        $para.Format.Alignment = 3 # Justify
    }
}

# Clean up trailing spaces in signature block
foreach ($para in $doc.Paragraphs) {
    $text = $para.Range.Text
    $cleanText = $text.Trim()
    
    if ($cleanText -match "^Sukabumi" -or $cleanText -match "^28 Juni" -or $cleanText -match "^Mudir Pesantren" -or $cleanText -match "^Ust\. Wahab") {
        
        # Remove trailing spaces safely
        for ($j = $para.Range.Characters.Count - 1; $j -ge 1; $j--) {
            $char = $para.Range.Characters.Item($j).Text
            if ($char -match "\s" -or $char -eq " ") {
                $para.Range.Characters.Item($j).Delete()
            } else {
                break
            }
        }
        
        # Ensure it is Right-Aligned
        $para.Format.LeftIndent = 0
        $para.Format.FirstLineIndent = 0
        $para.Format.Alignment = 2 # Right align
    }
}

$doc.Save()
$doc.ExportAsFixedFormat("$env:TEMP\Surat_Pemberitahuan_Kedatangan.pdf", 17)
$doc.Close()
$word.Quit()
