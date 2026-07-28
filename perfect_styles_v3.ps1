$word = New-Object -ComObject Word.Application
$word.Visible = $false

$doc = $word.Documents.Open("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx")

# 1. Right Align Arabic Text
for ($i = 1; $i -le $doc.Paragraphs.Count; $i++) {
    $para = $doc.Paragraphs.Item($i)
    if ($para.Range.Text.Trim() -match "^Alhamdulillah") {
        $arabicPara = $doc.Paragraphs.Item($i - 1)
        $arabicPara.Format.Alignment = 2 # Right align
        break
    }
}

# 2. Right Align Date and Name
foreach ($para in $doc.Paragraphs) {
    $text = $para.Range.Text.Trim()
    if ($text -match "^Sukabumi" -or $text -match "^28 Juni" -or $text -match "^Mudir Pesantren" -or $text -match "Wahab Rajasam") {
        $para.Format.Alignment = 2 # Right align
    }
}

# 3. Scale down shapes and keep them centered
foreach ($s in $doc.Shapes) {
    if ($s.Name -eq "Picture 3" -or $s.Name -eq "Picture 11") {
        $oldWidth = $s.Width
        $s.LockAspectRatio = $true
        
        $s.Width = $oldWidth * 0.70
        
        $widthDiff = $oldWidth - $s.Width
        $s.Left = $s.Left + ($widthDiff / 2)
        $s.Left = $s.Left + 30
    }
}

$doc.Save()
$doc.ExportAsFixedFormat("$env:TEMP\Surat_Pemberitahuan_Kedatangan.pdf", 17)
$doc.Close()
$word.Quit()
