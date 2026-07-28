$word = New-Object -ComObject Word.Application
$word.Visible = $false

$files = @(
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\file dari media\003-Surat Undangan Welcome Day Pesantren Al Imam Al Islami.docx"
)

foreach ($file in $files) {
    Write-Host "Processing $file..."
    $doc = $word.Documents.Open($file)
    
    $findText = "003/Pan-WD/AI/VI/2026"
    $replaceText = "002/UND/PSB/PP-AI/VI/2026"

    $doc.Content.Find.Execute($findText, $false, $false, $false, $false, $false, $true, 1, $false, $replaceText, 2)
    
    $doc.Save()
    $pdfPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Surat_Undangan_Welcome_Day.pdf"
    $doc.SaveAs($pdfPath, 17) # 17 is wdFormatPDF
    
    $doc.Close()
}

$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Host "Done!"
