Add-Type -AssemblyName System.Drawing
$uploadDir = "C:\Users\itpua\.gemini\antigravity\brain\9bef1ccc-e6b8-486f-a5e8-cd03924ee7b5\.user_uploaded"
$sigFile = "C:\Users\itpua\.gemini\antigravity\brain\9bef1ccc-e6b8-486f-a5e8-cd03924ee7b5\.user_uploaded\media__1784877018968.jpg"

$bmp = [System.Drawing.Bitmap]::FromFile($sigFile)
$newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        $gray = [int]($pixel.R * 0.3 + $pixel.G * 0.59 + $pixel.B * 0.11)
        
        $alpha = 255 - $gray
        if ($alpha -lt 50) { $alpha = 0 }
        elseif ($alpha -gt 150) { $alpha = 255 }
        
        $newPixel = [System.Drawing.Color]::FromArgb($alpha, 85, 0, 0)
        $newBmp.SetPixel($x, $y, $newPixel)
    }
}

$outPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\voucher-mosacup\ttd-rieza.png"
$newBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Write-Host "Restored original signature without bad erasure"
