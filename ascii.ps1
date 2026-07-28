Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\voucher-mosacup\ttd-rieza.png")

$w = 60
$h = 100
$bmp = New-Object System.Drawing.Bitmap($img, $w, $h)

$out = @()
for ($y = 0; $y -lt $h; $y++) {
    $line = ""
    for ($x = 0; $x -lt $w; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.A -gt 100) {
            $line += "##"
        } else {
            $line += ".."
        }
    }
    $out += ([string]::Format("{0} {1}", $y, $line))
}
$out | Out-File ascii_full.txt -Encoding UTF8
$bmp.Dispose()
$img.Dispose()
Write-Host "Done"
