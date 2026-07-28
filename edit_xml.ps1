Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
$tempDir = "$env:TEMP\docx_extract"

if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

[System.IO.Compression.ZipFile]::ExtractToDirectory($docxPath, $tempDir)

$xmlPath = "$tempDir\word\document.xml"
$xml = Get-Content $xmlPath -Raw

# Replace Point 5
$oldText = "Be tiba di pesantren, santri dan wali santri"
$newText = "Begitu tiba di pesantren, santri dan wali santri langsung menurunkan barang bawaan, kemudian mobil diarahkan ke area parkir."
$xml = $xml -replace $oldText, $newText

Set-Content -Path $xmlPath -Value $xml -Encoding UTF8

# Re-zip
$newDocxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED-XML.docx"
if (Test-Path $newDocxPath) { Remove-Item $newDocxPath -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $newDocxPath)

Write-Host "Done XML edit!"
