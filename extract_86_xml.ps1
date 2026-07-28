git checkout 86da8d8 -- "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
Copy-Item "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx" "temp_86da8d8.docx" -Force
git restore "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"

Add-Type -AssemblyName System.IO.Compression.FileSystem
$tempDir = "$env:TEMP\docx_extract_86_print"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
[System.IO.Compression.ZipFile]::ExtractToDirectory("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\temp_86da8d8.docx", $tempDir)
$xmlPath = "$tempDir\word\document.xml"
$xml = [System.IO.File]::ReadAllText($xmlPath, [System.Text.Encoding]::UTF8)

# Find Section B
$secBIndex = $xml.IndexOf("Tata Cara dan Alur Kegiatan")
if ($secBIndex -ge 0) {
    Write-Host "--- SECTION B XML ---"
    Write-Host $xml.Substring($secBIndex, 5000)
}
