$word = New-Object -ComObject Word.Application
$word.Visible = $false
$imgPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\images\kop-surat-full.jpg"

$docs = @(
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Draft_Surat_Pernyataan.docx",
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Draft_Pakta_Integritas.docx"
)

foreach ($file in $docs) {
    $doc = $word.Documents.Open($file)
    $header = $doc.Sections.Item(1).Headers.Item(1)
    
    # Check if shape already exists to avoid duplicates
    $hasShape = $false
    foreach ($s in $header.Shapes) {
        if ($s.Type -eq 13) { # msoPicture
            $hasShape = $true
            break
        }
    }
    
    if (-not $hasShape) {
        $shape = $header.Shapes.AddPicture($imgPath, $false, $true)
        $shape.WrapFormat.Type = 3 # wdWrapNone
        $shape.RelativeHorizontalPosition = 1 # wdRelativeHorizontalPositionPage
        $shape.RelativeVerticalPosition = 1 # wdRelativeVerticalPositionPage
        $shape.Left = 0
        $shape.Top = 0
        $shape.Width = $doc.PageSetup.PageWidth
        $shape.Height = $doc.PageSetup.PageHeight
        $shape.ZOrder(5) # msoSendBehindText
    }
    
    $doc.Save()
    $doc.Close()
}
$word.Quit()
Write-Host "DONE"
