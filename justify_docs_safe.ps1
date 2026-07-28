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
    
    if (-not (Test-Path $item.Docx)) {
        Write-Host "File not found, skipping."
        continue
    }

    $doc = $word.Documents.Open($item.Docx)
    
    foreach ($para in $doc.Paragraphs) {
        $text = $para.Range.Text
        
        # 0 = Left, 3 = Justify
        if ($para.Format.Alignment -eq 0) {
            # Check if it contains a tab (`\t` or char 9)
            $hasTab = $text -match "`t" -or $text.Contains([char]9)
            
            # Check if it contains a soft return / vertical tab (`\v` or char 11)
            $hasSoftReturn = $text -match "`v" -or $text.Contains([char]11)
            
            # Only justify if it's reasonably long, has no tabs, and no soft returns
            if ($text.Length -gt 60 -and -not $hasTab -and -not $hasSoftReturn) {
                $para.Format.Alignment = 3
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
