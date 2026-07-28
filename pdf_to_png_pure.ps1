$pdfPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\CETAK KOP SURAT VERSI 1 DAN 2.pdf"
$outDir = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents"

try {
    # 1. Load WinRT file
    $fileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync($pdfPath)
    while ($fileTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
    $file = $fileTask.GetResults()

    # 2. Load PDF document
    $pdfTask = [Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)
    while ($pdfTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
    $pdf = $pdfTask.GetResults()

    Write-Host "PDF loaded! Page count: $($pdf.PageCount)"

    # 3. Render page 1 (Versi 1) and page 2 (Versi 2)
    for ($i = 0; $i -lt $pdf.PageCount; $i++) {
        $page = $pdf.GetPage($i)
        
        $outPath = Join-Path $outDir "kop_versi_$($i + 1).png"
        $outFileTask = [Windows.Storage.StorageFolder]::GetFolderFromPathAsync($outDir).GetResults().CreateFileAsync("kop_versi_$($i + 1).png", [Windows.Storage.CreationCollisionOption]::ReplaceExisting)
        while ($outFileTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
        $outFile = $outFileTask.GetResults()
        
        $streamTask = $outFile.OpenAsync([Windows.Storage.FileAccessMode]::ReadWrite)
        while ($streamTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
        $stream = $streamTask.GetResults()
        
        $renderTask = $page.RenderToStreamAsync($stream)
        while ($renderTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
        $renderTask.GetResults() | Out-Null
        
        $flushTask = $stream.FlushAsync()
        while ($flushTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
        $flushTask.GetResults() | Out-Null
        
        $stream.Close()
        Write-Host "Rendered page $($i + 1) to $outPath"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
