$word = New-Object -ComObject Word.Application
$word.Visible = $false

function Convert-Docx ($infile, $outfile) {
    try {
        $doc = $word.Documents.Open($infile)
        
        # Change the font of the entire document to Times New Roman
        $doc.Content.Font.Name = "Times New Roman"
        
        $doc.SaveAs([ref]$outfile, [ref]17) # 17 = wdFormatPDF
        $doc.Close([ref]0) # 0 = wdDoNotSaveChanges
        Write-Host "Successfully converted to Times New Roman: $outfile"
    } catch {
        Write-Host "Error converting $infile : $_"
    }
}

$base = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam"
Convert-Docx "$base\clean_fixed.docx" "$base\clean_fixed.pdf"
Convert-Docx "$base\AIIS-Surat-Kesehatan-PSB-26-27-REVISED (1).docx" "$base\public\documents\Contoh_SuratKesehatan.pdf"
Convert-Docx "$base\Pakta_Integritas_Santri_dan_Orangtua (2).docx" "$base\public\documents\Contoh_PaktaIntegritas.pdf"
Convert-Docx "$base\Surat_Pernyataan_Orangtua_Wali (1).docx" "$base\public\documents\Contoh_SuratPernyataan.pdf"

$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
