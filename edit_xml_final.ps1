Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
$tempDir = "$env:TEMP\docx_extract_final"

if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

[System.IO.Compression.ZipFile]::ExtractToDirectory($docxPath, $tempDir)

$xmlPath = "$tempDir\word\document.xml"
$xml = Get-Content $xmlPath -Raw

# Replace Point 5
$oldText = "Be tiba di pesantren, santri dan wali santri"
$newText = "Begitu tiba di pesantren, santri dan wali santri langsung menurunkan barang bawaan, kemudian mobil diarahkan ke area parkir."
$xml = $xml -replace $oldText, $newText

# Fix trailing/leading spaces in Signature block
$xml = $xml -replace ' xml:space="preserve">\s+28 Juni 2026 M\.', '>28 Juni 2026 M.'
$xml = $xml -replace '>\s+28 Juni 2026 M\.', '>28 Juni 2026 M.'
$xml = $xml -replace ' xml:space="preserve">\s+Mudir Pesantren', '>Mudir Pesantren'
$xml = $xml -replace '>\s+Mudir Pesantren', '>Mudir Pesantren'

# Also ensure Sukabumi is flush right (remove any spaces)
$xml = $xml -replace ' xml:space="preserve">\s+Sukabumi', '>Sukabumi'
$xml = $xml -replace '>\s+Sukabumi', '>Sukabumi'

Set-Content -Path $xmlPath -Value $xml -Encoding UTF8

if (Test-Path $docxPath) { Remove-Item $docxPath -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $docxPath)

# Copy DOCX to public folder
Copy-Item $docxPath "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Surat_Pemberitahuan_Kedatangan.docx" -Force
Copy-Item $docxPath "C:\Users\itpua\Dev\Work\al-andalus\alandalus-ululalbaab\public\documents\Surat_Pemberitahuan_Kedatangan.docx" -Force
Copy-Item $docxPath "C:\Users\itpua\Dev\Work\al-andalus\template-demo\public\documents\Surat_Pemberitahuan_Kedatangan.docx" -Force

Write-Host "Done XML edit and copied DOCX!"
