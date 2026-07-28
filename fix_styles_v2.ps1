$word = New-Object -ComObject Word.Application
$word.Visible = $false

$files = @(
    @{
        Docx = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
        Pdf = "Surat_Pemberitahuan_Kedatangan.pdf"
    }
)

foreach ($item in $files) {
    Write-Host "Processing $($item.Docx)..."
    if (-not (Test-Path $item.Docx)) { continue }
    
    $doc = $word.Documents.Open($item.Docx)
    
    # 1. Resize stamp and signature shapes
    foreach ($s in $doc.Shapes) {
        if ($s.Name -eq "Picture 3") {
            $s.LockAspectRatio = $true
            $s.Width = 90 # Resize from 144
        }
        if ($s.Name -eq "Picture 11") {
            $s.LockAspectRatio = $true
            $s.Width = 80 # Resize from 110
        }
    }
    
    # 2. Fix Text Alignments
    for ($i = 1; $i -le $doc.Paragraphs.Count; $i++) {
        $para = $doc.Paragraphs.Item($i)
        $text = $para.Range.Text
        $trimText = $text.Trim()
        
        # Arabic Text -> Right Align (2) (It is the paragraph before Alhamdulillah)
        if ($trimText -match "^Alhamdulillah") {
            $arabicPara = $doc.Paragraphs.Item($i - 1)
            $arabicPara.Format.Alignment = 2
        }
        
        # Signature Block -> Right Align (2) and clear indents/spaces
        if ($trimText -match "^Sukabumi" -or $trimText -match "^28 Juni" -or $trimText -match "^Mudir Pesantren" -or $trimText -match "Wahab Rajasam") {
            # Trim the leading spaces in the document by removing them via regex replacement
            if ($text -match "^(\s+)") {
                $para.Range.Text = $trimText + "`r"
            }
            $para.Format.LeftIndent = 0
            $para.Format.FirstLineIndent = 0
            $para.Format.Alignment = 2 # Right align
        }
    }
    
    $doc.Save()
    
    $pdfName = $item.Pdf
    $tempPdf = "$env:TEMP\$pdfName"
    
    # Export to TEMP folder
    $doc.ExportAsFixedFormat($tempPdf, 17)
    $doc.Close()
}
$word.Quit()
