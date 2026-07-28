$dbData = Get-Content 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\pendaftar_db.jsonl' | ForEach-Object { ConvertFrom-Json $_ }

$filledPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Data_Siswa_CRM_Al_Imam_TERISI.xlsx'

function Get-IndoDate($dateStr) {
    if (-not $dateStr) { return "" }
    $dateStr = $dateStr -replace 'January', 'Januari'
    $dateStr = $dateStr -replace 'February', 'Februari'
    $dateStr = $dateStr -replace 'March', 'Maret'
    $dateStr = $dateStr -replace 'May', 'Mei'
    $dateStr = $dateStr -replace 'June', 'Juni'
    $dateStr = $dateStr -replace 'July', 'Juli'
    $dateStr = $dateStr -replace 'August', 'Agustus'
    $dateStr = $dateStr -replace 'October', 'Oktober'
    $dateStr = $dateStr -replace 'December', 'Desember'
    return $dateStr
}

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open($filledPath)
    $sheet = $wb.Sheets.Item(1)
    
    $rows = $sheet.UsedRange.Rows.Count
    for ($i = 2; $i -le $rows; $i++) {
        $nama = $sheet.Cells.Item($i, 4).Text
        if (-not $nama) { continue }
        
        $simpleName = $nama.ToLower() -replace '[^a-z0-9]', ''
        
        $match = $dbData | Where-Object { ($_.nama_lengkap.ToLower() -replace '[^a-z0-9]', '') -match $simpleName -or $simpleName -match ($_.nama_lengkap.ToLower() -replace '[^a-z0-9]', '') } | Select-Object -First 1
        
        if ($match) {
            if ($match.tempat_lahir) { $sheet.Cells.Item($i, 5).Value2 = [string]$match.tempat_lahir }
            
            $indoDate = Get-IndoDate $match.tgl_lahir
            if ($indoDate) { $sheet.Cells.Item($i, 6).Value2 = [string]$indoDate }
            
            if ($match.jenis_kelamin -eq 'L') { 
                $sheet.Cells.Item($i, 7).Value2 = 'Laki-laki' 
            } elseif ($match.jenis_kelamin -eq 'P') { 
                $sheet.Cells.Item($i, 7).Value2 = 'Perempuan' 
            }
            
            $alamatFull = @()
            if ($match.alamat) { $alamatFull += $match.alamat }
            if ($match.rt -and $match.rw) { $alamatFull += "RT $($match.rt) / RW $($match.rw)" }
            if ($match.kelurahan) { $alamatFull += "Kel. $($match.kelurahan)" }
            if ($match.kecamatan) { $alamatFull += "Kec. $($match.kecamatan)" }
            if ($match.kabupaten) { $alamatFull += $match.kabupaten }
            if ($match.provinsi) { $alamatFull += $match.provinsi }
            
            if ($alamatFull.Count -gt 0) {
                $sheet.Cells.Item($i, 8).Value2 = [string]($alamatFull -join ', ')
            }
        }
    }
    
    $wb.Save()
    Write-Host "Updated Excel with DB data including row 2"
} catch {
    Write-Host "Excel error: $_"
} finally {
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
