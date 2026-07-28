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

# Insert background
$imgPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\images\kop-surat-full.jpg"
$header = $doc.Sections.Item(1).Headers.Item(1)
$shape = $header.Shapes.AddPicture($imgPath, $false, $true)
$shape.WrapFormat.Type = 3
$shape.RelativeHorizontalPosition = 1
$shape.RelativeVerticalPosition = 1
$shape.Left = 0
$shape.Top = 0
$shape.Width = $doc.PageSetup.PageWidth
$shape.Height = $doc.PageSetup.PageHeight
$shape.ZOrder(5)

$doc.SaveAs([ref]$docxPath, [ref]16)
$doc.Close()
$word.Quit()
