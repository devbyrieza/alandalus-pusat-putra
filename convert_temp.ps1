$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = Resolve-Path "fixed_text.docx"
$pdfPath = [System.IO.Path]::Combine((Get-Location).Path, "temp_fixed.pdf")

$doc = $word.Documents.Open($docPath.Path)
$doc.SaveAs([ref] $pdfPath, [ref] 17) # 17 = wdFormatPDF
$doc.Close()
$word.Quit()
echo "Saved temp_fixed.pdf"
