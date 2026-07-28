git checkout 3a24713 -- "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
Copy-Item "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx" "temp_3a24713.docx" -Force
git restore "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"

Add-Type -AssemblyName System.IO.Compression.FileSystem
$tempDir = "$env:TEMP\docx_extract_3a24713"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
[System.IO.Compression.ZipFile]::ExtractToDirectory("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\temp_3a24713.docx", $tempDir)
$xmlPath = "$tempDir\word\document.xml"
$xml = [System.IO.File]::ReadAllText($xmlPath, [System.Text.Encoding]::UTF8)

if ($xml.Contains("Be tiba")) {
    Write-Host "Found 'Be tiba' in 3a24713!"
} else {
    Write-Host "Not found in 3a24713"
}

# Print context of "tiba di pesantren"
$index = $xml.IndexOf("tiba di pesantren")
if ($index -ge 0) {
    Write-Host $xml.Substring($index - 100, 200)
}
