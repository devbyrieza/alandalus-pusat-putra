Add-Type -AssemblyName System.Drawing

$mediaDir = "$env:TEMP\undangan_media_check\word\media"
Get-ChildItem $mediaDir | ForEach-Object {
    if ($_.Extension -ne ".wdp") {
        try {
            $img = [System.Drawing.Image]::FromFile($_.FullName)
            Write-Host "$($_.Name): $($img.Width) x $($img.Height) pixels"
            $img.Dispose()
        } catch {
            Write-Host "$($_.Name): Error: $($_.Exception.Message)"
        }
    } else {
        Write-Host "$($_.Name): Windows Media Photo (skipped)"
    }
}
