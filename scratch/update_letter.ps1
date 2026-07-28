$docPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
$pdfPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.pdf"

Write-Output "Memulai Word COM..."
$word = New-Object -ComObject Word.Application
$word.Visible = $false

try {
    Write-Output "Membuka dokumen: $docPath"
    $doc = $word.Documents.Open($docPath)

    # 1. Ganti Nomor Surat
    Write-Output "Mengganti nomor surat..."
    $findText = "04/TU/PP-AI/VI/2026"
    $replaceText = "001/PMB/TU/PP-AI/VI/2026"
    
    # Gunakan Find.Execute dari range dokumen agar mencakup seluruh dokumen termasuk header/footer
    $range = $doc.Content
    $range.Find.ClearFormatting()
    $range.Find.Execute(
        $findText, 
        $false, # MatchCase
        $false, # MatchWholeWord
        $false, # MatchWildcards
        $false, # MatchSoundsLike
        $false, # MatchAllWordForms
        $true,  # Forward
        1,      # Wrap (wdFindContinue)
        $false, # Format
        $replaceText, 
        2       # Replace (wdReplaceAll)
    ) | Out-Null

    # 2. Ganti Font Calibri menjadi Arial
    Write-Output "Mengganti font Calibri menjadi Arial..."
    $rangeFont = $doc.Content
    $rangeFont.Find.ClearFormatting()
    $rangeFont.Find.Replacement.ClearFormatting()
    $rangeFont.Find.Font.Name = "Calibri"
    $rangeFont.Find.Replacement.Font.Name = "Arial"
    $rangeFont.Find.Execute(
        "", 
        $false, $false, $false, $false, $false, $true, 1, 
        $true,  # Format = True (penting karena kita mencari berdasarkan format font)
        "", 
        2       # wdReplaceAll
    ) | Out-Null

    # Simpan kembali DOCX
    Write-Output "Menyimpan dokumen Word..."
    $doc.Save()

    # Ekspor ke PDF (wdFormatPDF = 17)
    Write-Output "Mengekspor ke PDF..."
    $doc.SaveAs($pdfPath, 17)

    Write-Output "Proses selesai dengan sukses!"
}
catch {
    Write-Error "Terjadi kesalahan: $_"
}
finally {
    if ($doc) {
        $doc.Close()
    }
    $word.Quit()
    # Bersihkan COM object dari memori
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    Remove-Variable word
}
