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
        
        # 2. Skip tabular paragraphs (like "Hari,Tanggal : \t Sabtu")
        if ($text -match "`t" -or $text.Contains([char]9)) { continue }
        
        # 3. Skip paragraphs with soft returns that are used for manual spacing
        if ($text -match "`v" -or $text.Contains([char]11)) { continue }
        
        # Process Lists (Numbered "1. " or Lettered "A. ")
        if ($trimText -match "^(([0-9]+)|([A-Z]))\.\s") {
            # Find the space after the number (e.g. after "1.")
            $firstSpace = $text.IndexOf(' ')
            if ($firstSpace -gt 0 -and $firstSpace -lt 5) {
                # Create a range specifically for that space character
                $spaceRange = $para.Range
                $spaceRange.Start = $para.Range.Start + $firstSpace
                $spaceRange.End = $spaceRange.Start + 1
                
                # Double check it is actually a space before replacing
                if ($spaceRange.Text -eq " ") {
                    $spaceRange.Text = "`t"
                }
            }
            
            # Apply Hanging Indent (25 points provides enough space for double-digit numbers like "10.")
            $para.Format.LeftIndent = 25
            $para.Format.FirstLineIndent = -25
            
            # Add a TabStop at 25 points so the tab jumps exactly to the hanging indent line
            $para.Format.TabStops.ClearAll()
            $para.Format.TabStops.Add(25)
            
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
