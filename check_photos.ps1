$originalDir = "C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\public\images\foto-kartu-jajan"
$transparentDir = "C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\public\images\foto-kartu-jajan-transparent"

$original = Get-ChildItem $originalDir -File | ForEach-Object { [System.IO.Path]::GetFileNameWithoutExtension($_.Name) }
$transparent = Get-ChildItem $transparentDir -File | ForEach-Object { [System.IO.Path]::GetFileNameWithoutExtension($_.Name) }

Write-Host "=== SUDAH ADA VERSI TRANSPARAN ===" -ForegroundColor Green
foreach ($t in $transparent) {
    Write-Host "  [OK] $t"
}

Write-Host ""
Write-Host "=== BELUM ADA VERSI TRANSPARAN ===" -ForegroundColor Red
$missing = $original | Where-Object { $_ -notin $transparent }
foreach ($m in $missing) {
    Write-Host "  [--] $m"
}

Write-Host ""
Write-Host "Total Foto Asli    : $($original.Count)"
Write-Host "Sudah Transparan   : $($transparent.Count)"
Write-Host "Belum Transparan   : $($missing.Count)"
