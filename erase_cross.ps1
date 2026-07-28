Add-Type -AssemblyName System.Drawing
$imgPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\voucher-mosacup\ttd-rieza.png"
$img = [System.Drawing.Image]::FromFile($imgPath)
$bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)

for ($y = 0; $y -lt $img.Height; $y++) {
    for ($x = 0; $x -lt $img.Width; $x++) {
        $pixel = $img.GetPixel($x, $y)
        
        # The bounding box to erase the left part of the crossbar precisely
        if ($x -ge 245 -and $x -le 325 -and $y -ge 710 -and $y -le 770) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            $bmp.SetPixel($x, $y, $pixel)
        }
    }
}
$img.Dispose()
$bmp.Save($imgPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Erased crossbar perfectly"
