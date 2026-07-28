$word = New-Object -ComObject Word.Application
$word.Visible = $false

$docxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Surat_Pengantar_BSI.docx"
$pdfPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Surat_Pengantar_BSI.pdf"
$imgPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\images\kop-surat-full.jpg"

try {
    $doc = $word.Documents.Open($docxPath)
    
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
    
    $doc.Save()
    $doc.SaveAs([ref]$pdfPath, [ref]17)
    $doc.Close()
    Write-Host "Success!"
} catch {
    Write-Error $_
} finally {
    $word.Quit()
}
