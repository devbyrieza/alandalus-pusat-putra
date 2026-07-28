$word = New-Object -ComObject Word.Application
$word.Visible = $false

$htmlPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Surat_Pengantar_BSI.html"
$docxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Surat_Pengantar_BSI.docx"

# Open HTML
$doc = $word.Documents.Open($htmlPath)

# Margins
$doc.PageSetup.TopMargin = 52 * 2.835
$doc.PageSetup.BottomMargin = 65 * 2.835
$doc.PageSetup.LeftMargin = 25 * 2.835
$doc.PageSetup.RightMargin = 25 * 2.835

# Save as wdFormatXMLDocument (16)
$doc.SaveAs([ref]$docxPath, [ref]16)
$doc.Close()
$word.Quit()
