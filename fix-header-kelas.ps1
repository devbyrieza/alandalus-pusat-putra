$filledPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Data_Siswa_CRM_Al_Imam_TERISI.xlsx'

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open($filledPath)
    $sheet = $wb.Sheets.Item(1)
    
    # 1. Update Kelas Detail
    $rows = $sheet.UsedRange.Rows.Count
    for ($i = 2; $i -le $rows; $i++) {
        $level = $sheet.Cells.Item($i, 9).Text
        if ($level -eq 'MTs') {
            $sheet.Cells.Item($i, 10).Value2 = "7 MTs"
        } elseif ($level -eq 'IL') {
            $sheet.Cells.Item($i, 10).Value2 = "Kelas IL"
        }
    }
    
    # 2. Re-style Header (Row 1) with Lighter Color
    # Background: Gold #ddc192 -> RGB(221, 193, 146)
    # Font: Black -> RGB(0, 0, 0)
    $headerRange = $sheet.Range("A1:L1")
    $headerRange.Interior.Color = 221 + (193 * 256) + (146 * 65536)
    $headerRange.Font.Color = 0
    
    $wb.Save()
    Write-Host "Updated Kelas Detail and Header Color successfully"
} catch {
    Write-Host "Excel error: $_"
} finally {
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
