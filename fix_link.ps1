$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx")
$selection = $word.Selection

$selection.HomeKey(6) # wdStory

# Find all occurrences of the link, case-insensitive
$FindText = "Https://ppdb.pesantren-alimam.com/dashboard/pendaftar/welcome-day"
$selection.Find.ClearFormatting()
$selection.Find.Text = $FindText
$selection.Find.MatchCase = $false

while ($selection.Find.Execute()) {
    # Replace the text first
    $selection.Text = "https://ppdb.pesantren-alimam.com/dashboard/pendaftar/welcome-day"
    
    # Add a hyperlink to the selected range
    $doc.Hyperlinks.Add($selection.Range, "https://ppdb.pesantren-alimam.com/dashboard/pendaftar/welcome-day", [ref]$null, [ref]$null, "https://ppdb.pesantren-alimam.com/dashboard/pendaftar/welcome-day")
    
    # Collapse range to end so it continues searching
    $selection.Collapse(0) # wdCollapseEnd
}

$doc.Save()
$doc.ExportAsFixedFormat("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Surat_Pemberitahuan_Kedatangan.pdf", 17)
$doc.ExportAsFixedFormat("C:\Users\itpua\Dev\Work\al-andalus\alandalus-ululalbaab\public\documents\Surat_Pemberitahuan_Kedatangan.pdf", 17)
$doc.ExportAsFixedFormat("C:\Users\itpua\Dev\Work\al-andalus\template-demo\public\documents\Surat_Pemberitahuan_Kedatangan.pdf", 17)
$doc.Close()
$word.Quit()
