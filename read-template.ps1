$path = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Template_Excel CRM.xlsx'
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
try {
    $wb = $excel.Workbooks.Open($path)
    foreach ($sheet in $wb.Sheets) {
        Write-Host "=== Sheet: $($sheet.Name) ==="
        for ($i = 1; $i -le 5; $i++) {
            $line = "$i :"
            for ($j = 1; $j -le 10; $j++) {
                $line += " $($sheet.Cells.Item($i, $j).Text) |"
            }
            Write-Host $line
        }
    }
} finally {
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
