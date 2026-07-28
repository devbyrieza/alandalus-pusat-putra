Add-Type -AssemblyName System.Drawing

$images = @(
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\extracted_img_1.png",
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\extracted_img_2.png"
)

foreach ($img in $images) {
    if (Test-Path $img) {
        $file = [System.Drawing.Image]::FromFile($img)
        Write-Host "$(Split-Path $img -Leaf): $($file.Width) x $($file.Height) pixels"
        $file.Dispose()
    } else {
        Write-Host "Not found: $img"
    }
}
