$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    # 1. Restore clean DOCX from commit 86da8d8 (perfect Arabic and numbering)
    git checkout 86da8d8 -- "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
    Copy-Item "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx" "temp_clean.docx" -Force
    git restore "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"

    $doc = $word.Documents.Open("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\temp_clean.docx")
    
    # Helper to clean spaces
    function Clean-ParagraphSpaces($p) {
        # Clean leading spaces
        while ($p.Range.Characters.First.Text -match "\s" -and $p.Range.Characters.First.Text -ne "`r") {
            $p.Range.Characters.First.Delete() | Out-Null
        }
        # Clean trailing spaces (before the paragraph mark)
        $r = $p.Range
        while ($r.Characters.Count -gt 1 -and $r.Characters.Item($r.Characters.Count - 1).Text -match "\s") {
            $r.Characters.Item($r.Characters.Count - 1).Delete() | Out-Null
        }
    }

    # 2. Set default font to Calibri
    $doc.Content.Font.Name = "Calibri"
    
    # 3. Find Section B index
    $secBIndex = -1
    for ($i = 1; $i -le $doc.Paragraphs.Count; $i++) {
        if ($doc.Paragraphs.Item($i).Range.Text -match "Tata Cara dan Alur Kegiatan") {
            $secBIndex = $i
            break
        }
    }
    
    # 4. Delete Point 5 inside Section B ONLY
    for ($i = $doc.Paragraphs.Count; $i -gt $secBIndex; $i--) {
        $para = $doc.Paragraphs.Item($i)
        $text = $para.Range.Text.Trim()
        if ($text -match "Santri yang tidak berkendaraan pribadi menempatkan barang bawaan") {
            $para.Range.Delete() | Out-Null
            break
        }
    }
    
    # 5. Process paragraphs (renumbering, font, alignment)
    for ($i = 1; $i -le $doc.Paragraphs.Count; $i++) {
        $para = $doc.Paragraphs.Item($i)
        $text = $para.Range.Text.Trim()
        
        # Change Arabic text specifically to Sakkal Majalla and size 14, and RIGHT align it
        if ($text -match "[\u0600-\u06FF]") {
            $para.Range.Font.Name = "Sakkal Majalla"
            $para.Range.Font.Size = 14
            $para.Format.Alignment = 2 # Right align
            $para.Format.RightIndent = 0
            $para.Format.LeftIndent = 0
            $para.Format.FirstLineIndent = 0
            Clean-ParagraphSpaces($para)
        }
        
        # Renumbering and editing ONLY for paragraphs in Section B ($i > $secBIndex)
        if ($i -gt $secBIndex) {
            # Replace Point 4 text without deleting paragraph mark
            if ($text -match "Santri yang membawa kendaraan pribadi tidak diperkenankan menurunkan barang bawaan") {
                $paraRange = $para.Range
                $paraRange.End = $paraRange.End - 1 # Keep paragraph mark
                $paraRange.Text = "4. Begitu tiba di pesantren, santri dan wali santri langsung menurunkan barang bawaan, kemudian mobil diarahkan ke area parkir."
                $para.Format.LeftIndent = 36
                $para.Format.FirstLineIndent = -36
                $para.Format.Alignment = 3 # Justify
            }
            # Renumber remaining points safely
            elseif ($text -match "^6\.") {
                $para.Range.Characters.Item(1).Text = "5"
            }
            elseif ($text -match "^7\.") {
                $para.Range.Characters.Item(1).Text = "6"
            }
            elseif ($text -match "^8\.") {
                $para.Range.Characters.Item(1).Text = "7"
            }
            elseif ($text -match "^9\.") {
                $para.Range.Characters.Item(1).Text = "8"
            }
            elseif ($text -match "^10\.") {
                $para.Range.Characters.Item(1).Text = "9"
                $para.Range.Characters.Item(2).Delete() | Out-Null
            }
            elseif ($text -match "^11\.") {
                $para.Range.Characters.Item(1).Text = "1"
                $para.Range.Characters.Item(2).Text = "0"
            }
        }
        
        # Align signature block right and clean spaces
        if ($text -match "Sukabumi" -or $text -match "28 Juni" -or $text -match "Mudir" -or $text -match "Wahab Rajasam") {
            $para.Format.Alignment = 2 # Right align
            $para.Format.RightIndent = 0
            $para.Format.LeftIndent = 0
            $para.Format.FirstLineIndent = 0
            Clean-ParagraphSpaces($para)
        }
    }
    
    # Save modified DOCX
    $finalDocx = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
    if (Test-Path $finalDocx) { Remove-Item $finalDocx -Force }
    $doc.SaveAs($finalDocx)
    
    # Convert to PDF
    $tempPdf = "$env:TEMP\Surat_Pemberitahuan_Kedatangan.pdf"
    if (Test-Path $tempPdf) { Remove-Item $tempPdf -Force -ErrorAction SilentlyContinue }
    $doc.ExportAsFixedFormat($tempPdf, 17)
    
    $doc.Close()
    Write-Host "Success via COM v3!"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $word.Quit()
}
