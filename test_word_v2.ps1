$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $doc = $word.Documents.Open("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx")
    
    # Fix Point 5
    foreach ($para in $doc.Paragraphs) {
        if ($para.Range.Text -match "tiba di pesantren") {
            $para.Range.Text = "5. Begitu tiba di pesantren, santri dan wali santri langsung menurunkan barang bawaan, kemudian mobil diarahkan ke area parkir."
            $para.Format.LeftIndent = 36
            $para.Format.FirstLineIndent = -36
            $para.Format.TabStops.ClearAll()
            $para.Format.TabStops.Add(36) | Out-Null
            $para.Format.Alignment = 3 # Justify
            break # IMPORTANT!
        }
    }
    
    # Fix Signature Block Alignment
    foreach ($para in $doc.Paragraphs) {
        $text = $para.Range.Text
        if ($text -match "Sukabumi|28 Juni|Mudir Pesantren|Wahab Rajasam") {
            $para.Format.Alignment = 2 # Right align
            $para.Format.RightIndent = 0
            $para.Format.LeftIndent = 0
        }
    }
    
    $doc.Save()
    
    $tempPdf = "$env:TEMP\Surat_Pemberitahuan_Kedatangan.pdf"
    if (Test-Path $tempPdf) { Remove-Item $tempPdf -Force -ErrorAction SilentlyContinue }
    $doc.ExportAsFixedFormat($tempPdf, 17)
    $doc.Close()
} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $word.Quit()
}
