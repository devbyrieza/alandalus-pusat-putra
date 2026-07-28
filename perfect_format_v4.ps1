$word = New-Object -ComObject Word.Application
$word.Visible = $false

$files = @(
    @{
        Docx = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
        Pdf = "Surat_Pemberitahuan_Kedatangan.pdf"
    },
    @{
        Docx = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Pakta_Integritas_Santri_dan_Orangtua (2).docx"
        Pdf = "Contoh_PaktaIntegritas.pdf"
    },
    @{
        Docx = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\AIIS-Surat-Kesehatan-PSB-26-27-REVISED (1).docx"
        Pdf = "Contoh_SuratKesehatan.pdf"
    },
    @{
        Docx = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Surat_Pernyataan_Orangtua_Wali (1).docx"
        Pdf = "Contoh_SuratPernyataan.pdf"
    }
)

foreach ($item in $files) {
    Write-Host "Processing $($item.Docx)..."
    if (-not (Test-Path $item.Docx)) { continue }
    
    $doc = $word.Documents.Open($item.Docx)
    
    foreach ($para in $doc.Paragraphs) {
        $text = $para.Range.Text
        $trimText = $text.Trim()
        
        $match = [regex]::Match($text, "^(([0-9]+)|([A-Z]))\.([ \t]+)")
        if ($match.Success) {
            $whitespaceGroup = $match.Groups[4]
            $startIndex = $whitespaceGroup.Index
            $length = $whitespaceGroup.Length
            
            $spaceRange = $para.Range
            $spaceRange.Start = $para.Range.Start + $startIndex
            $spaceRange.End = $spaceRange.Start + $length
            
            $spaceRange.Text = "`t"
            
            $para.Format.LeftIndent = 36
            $para.Format.FirstLineIndent = -36
            $para.Format.TabStops.ClearAll()
            $para.Format.TabStops.Add(36)
            
            if ($trimText -match "https://") {
                $para.Format.Alignment = 0
            } else {
                $para.Format.Alignment = 3
            }
        }
        else {
            if ($trimText.Length -lt 40) { continue }
            if ($text -match "`t" -or $text.Contains([char]9)) { continue }
            if ($text -match "`v" -or $text.Contains([char]11)) { continue }
            
            if ($trimText -match "https://") {
                $para.Format.Alignment = 0
            } else {
                $para.Format.Alignment = 3
            }
        }
    }
    
    $doc.Save()
    
    $pdfName = $item.Pdf
    $tempPdf = "$env:TEMP\$pdfName"
    
    # Export to TEMP folder to avoid file lock issues from Next.js server
    $doc.ExportAsFixedFormat($tempPdf, 17)
    $doc.Close()
    
    # Copy from TEMP to target repositories forcefully
    Copy-Item -Path $tempPdf -Destination "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\$pdfName" -Force
    Copy-Item -Path $tempPdf -Destination "C:\Users\itpua\Dev\Work\al-andalus\alandalus-ululalbaab\public\documents\$pdfName" -Force
    Copy-Item -Path $tempPdf -Destination "C:\Users\itpua\Dev\Work\al-andalus\template-demo\public\documents\$pdfName" -Force
}
$word.Quit()
