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
        
        # 1. Skip very short paragraphs (like titles, signatures, dates)
        if ($trimText.Length -lt 40) { continue }
        
        # 2. Skip tabular paragraphs
        if ($text -match "`t" -or $text.Contains([char]9)) { continue }
        
        # 3. Skip paragraphs with soft returns that are used for manual spacing
        if ($text -match "`v" -or $text.Contains([char]11)) { continue }
        
        # Process Lists (Numbered "1. " or Lettered "A. ")
        if ($trimText -match "^(([0-9]+)|([A-Z]))\.\s") {
            # Find the first space and replace with Tab to make hanging indent work
            $firstSpace = $trimText.IndexOf(' ')
            if ($firstSpace -gt 0 -and $firstSpace -lt 5) {
                # We do this by modifying the text in the document
                # But manipulating text directly via COM can lose formatting like bold/hyperlinks!
                # So we ONLY do it if it doesn't contain a hyperlink, to be safe.
                if ($para.Range.Hyperlinks.Count -eq 0) {
                    # Actually, a safer way to set hanging indent without replacing text:
                    # Just use standard indents. Word wraps after the first line. 
                    # If we don't insert a tab, the first line wraps correctly but the second line starts at LeftIndent.
                    # Since there's no tab, the first word after "1. " starts wherever the space is.
                    # That is perfectly fine and avoids text replacement bugs!
                }
            }
            
            # Apply Hanging Indent
            $para.Format.LeftIndent = 20
            $para.Format.FirstLineIndent = -20
            
            # Justify unless it has a long URL
            if ($trimText -match "https://") {
                $para.Format.Alignment = 0 # Left
            } else {
                $para.Format.Alignment = 3 # Justify
            }
        }
        else {
            # Normal paragraph
            # Justify unless it has a long URL
            if ($trimText -match "https://") {
                $para.Format.Alignment = 0 # Left
            } else {
                $para.Format.Alignment = 3 # Justify
            }
        }
    }
    
    $doc.Save()
    
    $pdfName = $item.Pdf
    $doc.ExportAsFixedFormat("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\$pdfName", 17)
    $doc.ExportAsFixedFormat("C:\Users\itpua\Dev\Work\al-andalus\alandalus-ululalbaab\public\documents\$pdfName", 17)
    $doc.ExportAsFixedFormat("C:\Users\itpua\Dev\Work\al-andalus\template-demo\public\documents\$pdfName", 17)
    $doc.Close()
}
$word.Quit()
