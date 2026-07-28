Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
$tempDir = "$env:TEMP\docx_extract_search"

if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

[System.IO.Compression.ZipFile]::ExtractToDirectory($docxPath, $tempDir)

$xmlPath = "$tempDir\word\document.xml"
$xml = [System.IO.File]::ReadAllText($xmlPath, [System.Text.Encoding]::UTF8)

# Find where "tiba di pesantren" is
$index = $xml.IndexOf("tiba di pesantren")
if ($index -ge 0) {
    # Print 500 characters before and after
    $start = [Math]::Max(0, $index - 300)
    $length = [Math]::Min($xml.Length - $start, 600)
    Write-Host "--- FOUND CONTEXT ---"
    Write-Host $xml.Substring($start, $length)
} else {
    Write-Host "Not found"
}
