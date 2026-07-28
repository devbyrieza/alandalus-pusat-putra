$word = New-Object -ComObject Word.Application
$word.Visible = $false

$docxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
$doc = $word.Documents.Open($docxPath)

# Fix Point 5 in Section B
foreach ($para in $doc.Paragraphs) {
    $text = $para.Range.Text
    if ($text -match "Begitu tiba di pesantren" -or $text -match "Be tiba di pesantren") {
        # Update the text but keep the paragraph mark at the end
        $para.Range.Text = "5. Begitu tiba di pesantren, santri dan wali santri langsung menurunkan barang bawaan, kemudian mobil diarahkan ke area parkir.`r"
        
        # Re-apply the hanging indent for this list item
        $para.Format.LeftIndent = 36
        $para.Format.FirstLineIndent = -36
        $para.Format.TabStops.ClearAll()
        $para.Format.TabStops.Add(36)
        $para.Format.Alignment = 3 # Justify
    }
}

# Clean up signature block spaces and align right
foreach ($para in $doc.Paragraphs) {
    $text = $para.Range.Text
    $cleanText = $text.Trim()
    
    if ($cleanText -match "^Sukabumi" -or $cleanText -match "^28 Juni" -or $cleanText -match "^Mudir Pesantren" -or $cleanText -match "^Ust\. Wahab") {
        
        # Remove trailing and leading spaces safely
        while ($para.Range.Characters.First.Text -match "\s" -and $para.Range.Characters.First.Text -ne "`r") {
            $para.Range.Characters.First.Delete()
        }
        while ($para.Range.Characters.Last.Previous().Text -match "\s") {
            $para.Range.Characters.Last.Previous().Delete()
        }
        
        $para.Format.LeftIndent = 0
        $para.Format.RightIndent = 0
        $para.Format.FirstLineIndent = 0
        $para.Format.Alignment = 2 # Right align
    }
}

$doc.Save()
$doc.ExportAsFixedFormat("$env:TEMP\Surat_Pemberitahuan_Kedatangan.pdf", 17)
$doc.Close()
$word.Quit()
