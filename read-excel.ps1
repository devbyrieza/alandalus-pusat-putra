$path = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Data_NIS_Santri_Baru_2026_Terpisah.xlsx'
if (-not (Test-Path $path)) {
    $path = 'C:\Users\itpua\Dev\Work\al-andalus\safina-keuangan\Data_NIS_Santri_Baru_2026_Terpisah.xlsx'
}

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
try {
    $wb = $excel.Workbooks.Open($path)
    $allData = @()
    foreach ($sheet in $wb.Sheets) {
        $rows = $sheet.UsedRange.Rows.Count
        Write-Host "Sheet: $($sheet.Name), Rows: $rows"
        for ($i = 2; $i -le $rows; $i++) {
            $no = $sheet.Cells.Item($i, 1).Text
            $nis = $sheet.Cells.Item($i, 2).Text
            $nama = $sheet.Cells.Item($i, 3).Text
            if ($nis -and $nama) {
                $allData += @{ Jenjang=$sheet.Name; No=$no; NIS=$nis; Nama=$nama }
            }
        }
    }
    $allData | ConvertTo-Json | Out-File 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\santri-baru.json'
    Write-Host "Extracted $($allData.Count) records."
} finally {
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
