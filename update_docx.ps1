$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx")
$selection = $word.Selection

$FindText = " yang telah dilegalisir"
$ReplaceText = ""
$selection.Find.Execute($FindText, $false, $false, $false, $false, $false, $true, 1, $false, $ReplaceText, 2)

$FindText2 = "Menu Welcome Day di Dashboard Pendaftar"
$ReplaceText2 = "https://ppdb.pesantren-alimam.com/dashboard/pendaftar/welcome-day"
$selection.Find.Execute($FindText2, $false, $false, $false, $false, $false, $true, 1, $false, $ReplaceText2, 2)

$FindText3 = "Wali santri beserta santri baru"
$ReplaceText3 = "calon santri baru"
$selection.Find.Execute($FindText3, $false, $false, $false, $false, $false, $true, 1, $false, $ReplaceText3, 2)

$FindText4 = "[LINK KONFIRMASI]"
$ReplaceText4 = "https://ppdb.pesantren-alimam.com/dashboard/pendaftar/welcome-day"
$selection.Find.Execute($FindText4, $false, $false, $false, $false, $false, $true, 1, $false, $ReplaceText4, 2)

$doc.Save()
$doc.ExportAsFixedFormat("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Surat_Pemberitahuan_Kedatangan.pdf", 17)
$doc.ExportAsFixedFormat("C:\Users\itpua\Dev\Work\al-andalus\alandalus-ululalbaab\public\documents\Surat_Pemberitahuan_Kedatangan.pdf", 17)
$doc.Close()
$word.Quit()
