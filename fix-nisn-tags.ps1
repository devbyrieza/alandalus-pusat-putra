$dbData = Get-Content 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\pendaftar_db.jsonl' | ForEach-Object { ConvertFrom-Json $_ }

$filledPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Data_Siswa_CRM_Al_Imam_TERISI.xlsx'

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
        
        if ($match -and $match.nisn) {
            $sheet.Cells.Item($i, 3).NumberFormat = "@"
            $sheet.Cells.Item($i, 3).Value2 = [string]$match.nisn
        } else {
            $sheet.Cells.Item($i, 3).Value2 = "-"
        }
        
        # Tags (Level, Putra, Year)
        $level = $sheet.Cells.Item($i, 9).Text
        $sheet.Cells.Item($i, 11).Value2 = "$level, Santri Putra, Baru 2026"
        
        # Note
        $sheet.Cells.Item($i, 12).Value2 = "Tahun Ajaran 2026/2027"
    }
    
    # Auto-fit columns 3, 11, 12
    [void]$sheet.Columns.Item("C:C").AutoFit()
    [void]$sheet.Columns.Item("K:L").AutoFit()
    
    # Fix the dark cell in M1 (clear styling)
    $sheet.Range("M1").ClearFormats()
    $sheet.Range("M1:Z100").Borders.LineStyle = -4142 # xlNone
    
    $wb.Save()
    Write-Host "Filled NISN, Tags, Note, and cleared M1 successfully"
} catch {
    Write-Host "Excel error: $_"
} finally {
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
