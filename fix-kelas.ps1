$filledPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Data_Siswa_CRM_Al_Imam_TERISI.xlsx'

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open($filledPath)
    $sheet = $wb.Sheets.Item(1)
    
    $rows = $sheet.UsedRange.Rows.Count
    for ($i = 2; $i -le $rows; $i++) {
        $level = $sheet.Cells.Item($i, 9).Text
        if ($level -eq 'MTs') {
            $sheet.Cells.Item($i, 10).Value2 = "7 MTs"
        } elseif ($level -eq 'IL') {
            $sheet.Cells.Item($i, 10).Value2 = "Kelas IL"
        }
    }
    
    # Auto-fit column 10 just in case
    [void]$sheet.Columns.Item("J:J").AutoFit()
    
    $wb.Save()
    Write-Host "Updated Kelas Detail successfully"
} catch {
    Write-Host "Excel error: $_"
} finally {
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
