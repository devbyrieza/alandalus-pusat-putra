Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\voucher-mosacup\ttd-rieza.png")

for ($y = 0; $y -lt $img.Height; $y++) {
    $horizLen = 0
    $startX = -1
    $maxLen = 0
    for ($x = 0; $x -lt $img.Width; $x++) {
        $pixel = $img.GetPixel($x, $y)
        if ($pixel.A -gt 50) {
            if ($startX -eq -1) { $startX = $x }
            $horizLen++
        } else {
            if ($horizLen -gt $maxLen) { $maxLen = $horizLen }
            $horizLen = 0
            $startX = -1
        }
    }
    if ($maxLen -gt 150) {
        Write-Host "Row $y has a long horizontal segment of length $maxLen"
    }
}
$img.Dispose()
