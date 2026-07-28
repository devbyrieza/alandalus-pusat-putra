Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
$tempDir = "$env:TEMP\docx_extract_search_5"

if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

[System.IO.Compression.ZipFile]::ExtractToDirectory($docxPath, $tempDir)

$xmlPath = "$tempDir\word\document.xml"
$xml = [System.IO.File]::ReadAllText($xmlPath, [System.Text.Encoding]::UTF8)

# Find all occurrences of <w:t>X.</w:t> where X is a number
$matches = [regex]::Matches($xml, "<w:t>\d+\.</w:t>.*?<w:t>.*?</w:t>")
foreach ($m in $matches) {
    Write-Host $m.Value
}
