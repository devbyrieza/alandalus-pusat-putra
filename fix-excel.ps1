$filledPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Data_Siswa_CRM_Al_Imam_TERISI.xlsx'

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
try {
    $wb = $excel.Workbooks.Open($filledPath)
    $sheet = $wb.Sheets.Item(1)
    
    # Clear dummy data from row 2
    $sheet.Cells.Item(2, 3).Value2 = $null # Identitas 2
    $sheet.Cells.Item(2, 5).Value2 = $null # Tempat Lahir
    $sheet.Cells.Item(2, 6).Value2 = $null # Tanggal Lahir
    $sheet.Cells.Item(2, 7).Value2 = $null # Jenis Kelamin
    $sheet.Cells.Item(2, 8).Value2 = $null # Alamat
    $sheet.Cells.Item(2, 10).Value2 = $null # Kelas Detail
    $sheet.Cells.Item(2, 11).Value2 = $null # Tags
    $sheet.Cells.Item(2, 12).Value2 = $null # Note
    
    $wb.Save()
    Write-Host "Cleared dummy data in Row 2"
} catch {
    Write-Host "Excel error: $_"
} finally {
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
