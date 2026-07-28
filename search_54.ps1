git checkout 541a726 -- "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
Copy-Item "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx" "temp_541a726.docx" -Force
git restore "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"

Add-Type -AssemblyName System.IO.Compression.FileSystem
$tempDir = "$env:TEMP\docx_extract_541a726"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
[System.IO.Compression.ZipFile]::ExtractToDirectory("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\temp_541a726.docx", $tempDir)
$xmlPath = "$tempDir\word\document.xml"
$xml = [System.IO.File]::ReadAllText($xmlPath, [System.Text.Encoding]::UTF8)

if ($xml.Contains("Be tiba")) {
    Write-Host "Found 'Be tiba' in 541a726!"
} else {
    Write-Host "Not found in 541a726"
}
