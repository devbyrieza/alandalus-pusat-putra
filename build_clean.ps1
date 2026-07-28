$word = New-Object -ComObject Word.Application
$word.Visible = $false

# 1. Unzip
if (Test-Path "clean_docx_unzip") { Remove-Item "clean_docx_unzip" -Recurse -Force }
Expand-Archive -Path "docx_unzip.zip" -DestinationPath "clean_docx_unzip" -Force

# 2. Fix XML
$xmlPath = "clean_docx_unzip\word\document.xml"
$xml = Get-Content $xmlPath -Raw
$searchStr = "<w:t>4. Begitu tiba di pesantren"
$replaceStr = "<w:t>4.</w:t></w:r><w:r><w:tab/></w:r><w:r><w:t>Begitu tiba di pesantren"
$xml = $xml.Replace($searchStr, $replaceStr)
Set-Content -Path $xmlPath -Value $xml

# 3. Zip
if (Test-Path "clean_fixed.zip") { Remove-Item "clean_fixed.zip" -Force }
if (Test-Path "clean_fixed.docx") { Remove-Item "clean_fixed.docx" -Force }
Compress-Archive -Path "clean_docx_unzip\*" -DestinationPath "clean_fixed.zip" -Force
Rename-Item "clean_fixed.zip" "clean_fixed.docx"

# 4. Convert to PDF
$docPath = Resolve-Path "clean_fixed.docx"
$pdfPath = [System.IO.Path]::Combine((Get-Location).Path, "clean_fixed.pdf")
if (Test-Path $pdfPath) { Remove-Item $pdfPath -Force }

$doc = $word.Documents.Open($docPath.Path)
$doc.SaveAs([ref] $pdfPath, [ref] 17) # 17 = wdFormatPDF
$doc.Close()
$word.Quit()
echo "Saved clean_fixed.pdf"
