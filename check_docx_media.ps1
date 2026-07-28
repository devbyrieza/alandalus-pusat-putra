Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxFiles = @(
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx",
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\AIIS-Surat-Kesehatan-PSB-26-27-REVISED (1).docx",
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Pakta_Integritas_Santri_dan_Orangtua (2).docx",
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Surat_Pernyataan_Orangtua_Wali (1).docx"
)

foreach ($file in $docxFiles) {
    Write-Host "=== FILE: $(Split-Path $file -Leaf) ==="
    $tempDir = "$env:TEMP\docx_media_check_$(Split-Path $file -Leaf)"
    if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
    
    try {
        [System.IO.Compression.ZipFile]::ExtractToDirectory($file, $tempDir)
        $mediaDir = "$tempDir\word\media"
        if (Test-Path $mediaDir) {
            Get-ChildItem $mediaDir | ForEach-Object {
                Write-Host "  $($_.Name) - $($_.Length) bytes"
            }
        } else {
            Write-Host "  No media folder"
        }
    } catch {
        Write-Host "  Error: $($_.Exception.Message)"
    }
}
