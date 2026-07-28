$filledPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Data_Siswa_CRM_Al_Imam_TERISI.xlsx'

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open($filledPath)
    $sheet = $wb.Sheets.Item(1)
    
    # 1. Clear leftover dummy data in row 2
    $sheet.Cells.Item(2, 3).Value2 = $null # Identitas 2
    $sheet.Cells.Item(2, 10).Value2 = $null # Kelas Detail
    $sheet.Cells.Item(2, 11).Value2 = $null # Tags
    $sheet.Cells.Item(2, 12).Value2 = $null # Note
    
    # 2. Style Header (Row 1) with Al Imam Palette
    # Background: #2a0000 -> RGB(42, 0, 0)
    # Font: #ddc192 -> RGB(221, 193, 146)
    $headerRange = $sheet.Range("A1:M1")
    $headerRange.Interior.Color = 42 + (0 * 256) + (0 * 65536) # Excel Color uses BGR or RGB depending, let's use RGB format: R + G*256 + B*65536 = 42
    $headerRange.Font.Color = 221 + (193 * 256) + (146 * 65536)
    $headerRange.Font.Bold = $true
    
    # 3. Add borders to the whole table
    $usedRange = $sheet.UsedRange
    $usedRange.Borders.LineStyle = 1 # xlContinuous
    $usedRange.Borders.Weight = 2    # xlThin
    
    # 4. Autofit columns (A to I are the most important)
    [void]$sheet.Columns.Item("A:I").AutoFit()
    
    # Fix column A width if it's too small
    $sheet.Columns.Item("A:A").ColumnWidth = 5
    
    $wb.Save()
    Write-Host "Excel styled and cleaned successfully!"
} catch {
    Write-Host "Excel error: $_"
} finally {
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
