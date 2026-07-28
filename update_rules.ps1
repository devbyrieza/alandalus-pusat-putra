$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx")
$selection = $word.Selection

$selection.HomeKey(6)

# We will replace the paragraphs based on substring matches.
# 4. Santri yang membawa kendaraan pribadi tidak diperkenankan menurunkan barang bawaan hingga acara Welcome Day selesai.
# 5. Santri yang tidak berkendaraan pribadi menempatkan barang bawaan di area masjid yang telah ditentukan.

foreach ($para in $doc.Paragraphs) {
    $text = $para.Range.Text
    if ($text -match "^4\.\s+Santri yang membawa kendaraan pribadi") {
        $para.Range.Text = "4. Begitu tiba di pesantren, santri dan wali santri langsung menurunkan barang bawaan, kemudian mobil diarahkan ke area parkir.`r"
    }
    if ($text -match "^5\.\s+Santri yang tidak berkendaraan pribadi") {
        $para.Range.Text = "" # Delete it entirely
    }
    # Renumber the rest
    if ($text -match "^6\.\s+") { $para.Range.Text = $text -replace "^6\.", "5." }
    if ($text -match "^7\.\s+") { $para.Range.Text = $text -replace "^7\.", "6." }
    if ($text -match "^8\.\s+") { $para.Range.Text = $text -replace "^8\.", "7." }
    if ($text -match "^9\.\s+") { $para.Range.Text = $text -replace "^9\.", "8." }
    if ($text -match "^10\.\s+") { $para.Range.Text = $text -replace "^10\.", "9." }
    if ($text -match "^11\.\s+") { $para.Range.Text = $text -replace "^11\.", "10." }
}

$doc.Save()
$doc.Close()
$word.Quit()
