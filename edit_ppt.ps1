$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue
$pres = $ppt.Presentations.Open("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\jempol_amanah_v2-1 (1).pptx", [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)

# Helper function to find text shape containing specific text
function Replace-Text {
    param($slide, $oldText, $newText)
    foreach($shape in $slide.Shapes) {
        if($shape.HasTextFrame) {
            if($shape.TextFrame.TextRange.Text -match $oldText) {
                $shape.TextFrame.TextRange.Text = $newText
            }
        }
    }
}

# --- SLIDE 13: GAME 1 (HOAKS ATAU FAKTA) ---
$slide13 = $pres.Slides.Item(13)
# Let's duplicate it 2 times so we have 3 slides for the 10 statements (4, 4, 2)
$slide13_part2 = $slide13.Duplicate()
$slide13_part3 = $slide13.Duplicate()

# Slide 13 (Q1-4)
$text1 = "PERNYATAAN 1 - 4:
1. `"Share berita tanpa cek dulu tidak ada dosanya karena kita hanya meneruskan`"
❌ HOAKS

2. `"Indonesia termasuk pengguna medsos terbesar di dunia`"
✅ FAKTA

3. `"Malaikat hanya mencatat ucapan lisan, bukan tulisan di HP`"
❌ HOAKS

4. `"Ada UU di Indonesia yang bisa menjerat penebar hoaks`"
✅ FAKTA"

# Slide 14 (was slide13_part2) (Q5-8)
$text2 = "PERNYATAAN 5 - 8:
5. `"Ghibah di story Instagram tidak sama dosanya dengan ghibah langsung`"
❌ HOAKS

6. `"TikTok bisa digunakan untuk dakwah Islam`"
✅ FAKTA

7. `"Hapus komentar jahat yang sudah kita tulis = dosa terhapus juga`"
❌ HOAKS

8. `"Tabayyun artinya klarifikasi/cek kebenaran sebelum menyebarkan`"
✅ FAKTA"

# Slide 15 (was slide13_part3) (Q9-10)
$text3 = "PERNYATAAN 9 - 10:
9. `"Like konten haram tidak ada konsekuensinya`"
❌ HOAKS

10. `"Medsos bisa jadi ladang pahala kalau dipakai dengan niat dakwah`"
✅ FAKTA"

# We need to find the shape with the "CONTOH PERNYATAAN" text and replace it.
foreach($shape in $slide13.Shapes) {
    if($shape.HasTextFrame -and $shape.TextFrame.TextRange.Text -match "CONTOH PERNYATAAN") {
        $shape.TextFrame.TextRange.Text = $text1
    }
}
foreach($shape in $slide13_part2.Shapes) {
    if($shape.HasTextFrame -and $shape.TextFrame.TextRange.Text -match "CONTOH PERNYATAAN") {
        $shape.TextFrame.TextRange.Text = $text2
    }
}
foreach($shape in $slide13_part3.Shapes) {
    if($shape.HasTextFrame -and $shape.TextFrame.TextRange.Text -match "CONTOH PERNYATAAN") {
        $shape.TextFrame.TextRange.Text = $text3
    }
}

# Now the slide indices are shifted.
# Original Slide 14 is now Slide 16 (Estafet Dakwah)
# Original Slide 15 is now Slide 17 (Skenario Jempol)

# --- SLIDE 17: GAME 3 (SKENARIO JEMPOL) ---
$slide17 = $pres.Slides.Item(17)
# Duplicate it so we have 2 slides for 8 scenarios (4 and 4)
$slide17_part2 = $slide17.Duplicate()

$scen1 = "SKENARIO 1 - 4:
1. `"Saat liburan dapat video lucu tapi menghina ulama - kamu share ke teman?`"
❌ JANGAN (Ghibah & fitnah)

2. `"Ada info bermanfaat dari akun dakwah terpercaya - share ke grup keluarga?`"
✅ LAKUKAN (Amar ma'ruf)

3. `"Foto teman yang sedang tidur lucu - upload ke story tanpa izin?`"
❌ JANGAN (Perlu izin)

4. `"Dapat berita buruk tentang ustadz pesantren - langsung sebar?`"
❌ JANGAN (Tabayyun dulu)"

$scen2 = "SKENARIO 5 - 8:
5. `"Waktu liburan scroll TikTok sampai hampir masuk waktu Ashar?`"
❌ STOP (Shalat lebih utama)

6. `"Ada teman lama yang di-bully di medsos - kamu diam saja?`"
❌ JANGAN DIAM (Bela teman)

7. `"Dapat berita hoaks sudah terlanjur share - kamu diam saja?`"
❌ JANGAN (Klarifikasi segera)

8. `"Teman mengajak nonton konten haram bareng saat liburan?`"
❌ JANGAN (Tinggalkan)"

foreach($shape in $slide17.Shapes) {
    if($shape.HasTextFrame -and $shape.TextFrame.TextRange.Text -match "CONTOH SKENARIO") {
        $shape.TextFrame.TextRange.Text = $scen1
    }
}
foreach($shape in $slide17_part2.Shapes) {
    if($shape.HasTextFrame -and $shape.TextFrame.TextRange.Text -match "CONTOH SKENARIO") {
        $shape.TextFrame.TextRange.Text = $scen2
    }
}

$pres.SaveAs("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\jempol_amanah_v2-1_FINAL.pptx")
$pres.Close()
$ppt.Quit()

Write-Output "Done editing PPTX"
