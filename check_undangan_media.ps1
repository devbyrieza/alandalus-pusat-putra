Add-Type -AssemblyName System.IO.Compression.FileSystem

$file = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\file dari media\003-Surat Undangan Welcome Day Pesantren Al Imam Al Islami.docx"
$tempDir = "$env:TEMP\undangan_media_check"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }

try {
    [System.IO.Compression.ZipFile]::ExtractToDirectory($file, $tempDir)
    $mediaDir = "$tempDir\word\media"
    if (Test-Path $mediaDir) {
        Get-ChildItem $mediaDir | ForEach-Object {
            Write-Host "Found image: $($_.Name) - $($_.Length) bytes"
        }
        
        # Check dimensions of the images
        Add-Type -AssemblyName System.Drawing
        Get-ChildItem $mediaDir | ForEach-Object {
            $img = [System.Drawing.Image]::FromFile($_.FullName)
            Write-Host "  $($_.Name): $($img.Width) x $($img.Height) pixels"
            $img.Dispose()
        }
    } else {
        Write-Host "No media folder"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
