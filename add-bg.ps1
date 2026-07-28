$word = New-Object -ComObject Word.Application
$word.Visible = $false

$imgPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\images\kop-surat-full.jpg"
$destSP = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Draft_Surat_Pernyataan.docx"
$docSP = $word.Documents.Open($destSP)

$header = $docSP.Sections.Item(1).Headers.Item(1)
$shape = $header.Shapes.AddPicture($imgPath, $false, $true)
$shape.WrapFormat.Type = 3 # wdWrapNone
$shape.RelativeHorizontalPosition = 1 # Page
$shape.RelativeVerticalPosition = 1 # Page
$shape.Left = 0
$shape.Top = 0
$shape.Width = $docSP.PageSetup.PageWidth
$shape.Height = $docSP.PageSetup.PageHeight
$shape.ZOrder(5) # msoSendBehindText

$docSP.Save()
$docSP.Close()
$word.Quit()
