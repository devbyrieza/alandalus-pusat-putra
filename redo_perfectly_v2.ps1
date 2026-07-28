# 1. Restore the clean docx from commit 86da8d8
git checkout 86da8d8 -- "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
Copy-Item "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx" "temp_clean.docx" -Force
git restore "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"

# 2. Extract XML
Add-Type -AssemblyName System.IO.Compression.FileSystem
$tempDir = "$env:TEMP\docx_extract_redo_v2"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
[System.IO.Compression.ZipFile]::ExtractToDirectory("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\temp_clean.docx", $tempDir)

$xmlPath = "$tempDir\word\document.xml"
[xml]$xml = [System.IO.File]::ReadAllText($xmlPath, [System.Text.Encoding]::UTF8)

# 3. XML DOM Namespace Setup
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")

# Update fonts for all runs dynamically
$runs = $xml.SelectNodes("//w:r", $ns)
foreach ($run in $runs) {
    $tNode = $run.SelectSingleNode("w:t", $ns)
    if ($tNode -ne $null) {
        $runText = $tNode.InnerText
        
        # Get or create rPr
        $rPr = $run.SelectSingleNode("w:rPr", $ns)
        if ($rPr -eq $null) {
            $rPr = $xml.CreateElement("w", "rPr", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
            $run.PrependChild($rPr) | Out-Null
        }
        
        # Get or create rFonts
        $rFonts = $rPr.SelectSingleNode("w:rFonts", $ns)
        if ($rFonts -eq $null) {
            $rFonts = $xml.CreateElement("w", "rFonts", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
            $rPr.AppendChild($rFonts) | Out-Null
        }
        
        # Check if text contains Arabic characters (Unicode range 0600-06FF)
        if ($runText -match "[\u0600-\u06FF]") {
            $rFonts.SetAttribute("ascii", "Sakkal Majalla")
            $rFonts.SetAttribute("hAnsi", "Sakkal Majalla")
            $rFonts.SetAttribute("cs", "Sakkal Majalla")
            
            # Make Arabic text slightly larger for better readability (usually 14pt or 16pt looks good, but let's keep it standard or slightly increase if needed. Arial Arabic is small, Sakkal Majalla is normal. Let's force size to 14pt (28 in half-points) for Arabic runs)
            $sz = $rPr.SelectSingleNode("w:sz", $ns)
            if ($sz -eq $null) {
                $sz = $xml.CreateElement("w", "sz", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
                $rPr.AppendChild($sz) | Out-Null
            }
            $sz.SetAttribute("val", "28") # 14 pt
            
            $szCs = $rPr.SelectSingleNode("w:szCs", $ns)
            if ($szCs -eq $null) {
                $szCs = $xml.CreateElement("w", "szCs", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
                $rPr.AppendChild($szCs) | Out-Null
            }
            $szCs.SetAttribute("val", "28")
        } else {
            $rFonts.SetAttribute("ascii", "Calibri")
            $rFonts.SetAttribute("hAnsi", "Calibri")
            $rFonts.SetAttribute("cs", "Calibri")
        }
    }
}

# 4. Process paragraphs for point 5, list numbering, and signature alignment
$paras = $xml.SelectNodes("//w:p", $ns)
$secBStarted = $false
$toDelete = $null

foreach ($para in $paras) {
    $text = $para.InnerText.Trim()
    
    if ($text -match "Tata Cara dan Alur Kegiatan") {
        $secBStarted = $true
        continue
    }
    
    if ($secBStarted) {
        if ($text -match "^4\.") {
            # Update Point 4 text
            $tNodes = $para.SelectNodes(".//w:t", $ns)
            foreach ($t in $tNodes) {
                if ($t.InnerText -match "Santri yang membawa") {
                    $t.InnerText = "Begitu tiba di pesantren, santri dan wali santri langsung menurunkan barang bawaan, kemudian mobil diarahkan ke area parkir."
                }
            }
        }
        elseif ($text -match "^5\.") {
            # Delete Point 5
            $toDelete = $para
        }
        elseif ($text -match "^6\.") {
            $t = $para.SelectSingleNode(".//w:t", $ns)
            $t.InnerText = "5."
        }
        elseif ($text -match "^7\.") {
            $t = $para.SelectSingleNode(".//w:t", $ns)
            $t.InnerText = "6."
        }
        elseif ($text -match "^8\.") {
            $t = $para.SelectSingleNode(".//w:t", $ns)
            $t.InnerText = "7."
        }
        elseif ($text -match "^9\.") {
            $t = $para.SelectSingleNode(".//w:t", $ns)
            $t.InnerText = "8."
        }
        elseif ($text -match "^10\.") {
            $t = $para.SelectSingleNode(".//w:t", $ns)
            $t.InnerText = "9."
        }
        elseif ($text -match "^11\.") {
            $t = $para.SelectSingleNode(".//w:t", $ns)
            $t.InnerText = "10."
        }
    }
    
    # Align signature block right and clean spaces
    if ($text -match "Sukabumi" -or $text -match "28 Juni" -or $text -match "Mudir Pesantren" -or $text -match "Wahab Rajasam") {
        $pPr = $para.SelectSingleNode("w:pPr", $ns)
        if ($pPr -eq $null) {
            $pPr = $xml.CreateElement("w", "pPr", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
            $para.PrependChild($pPr) | Out-Null
        }
        $jc = $pPr.SelectSingleNode("w:jc", $ns)
        if ($jc -eq $null) {
            $jc = $xml.CreateElement("w", "jc", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
            $pPr.AppendChild($jc) | Out-Null
        }
        $jc.SetAttribute("val", "right")
        
        # Clean leading spaces in text nodes
        $tNodes = $para.SelectNodes(".//w:t", $ns)
        foreach ($t in $tNodes) {
            if ($t.InnerText -match "^\s+") {
                $t.InnerText = $t.InnerText.TrimStart()
            }
        }
    }
}

if ($toDelete -ne $null) {
    $toDelete.ParentNode.RemoveChild($toDelete) | Out-Null
}

# 5. Save XML with UTF8 without BOM
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($xmlPath, $xml.OuterXml, $utf8NoBom)

# 6. Re-zip
$finalDocx = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
if (Test-Path $finalDocx) { Remove-Item $finalDocx -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $finalDocx)

# 7. Convert to PDF using VBScript
$tempPdf = "$env:TEMP\Surat_Pemberitahuan_Kedatangan.pdf"
if (Test-Path $tempPdf) { Remove-Item $tempPdf -Force -ErrorAction SilentlyContinue }

Stop-Process -Name WINWORD -Force -ErrorAction SilentlyContinue
cscript //nologo convert.vbs $finalDocx $tempPdf

# 8. Copy to all three repositories (PDF with spaces)
$destName = "Surat Pemberitahuan Kedatangan Santri Baru 2026-2027.pdf"
$repos = @(
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam",
    "C:\Users\itpua\Dev\Work\al-andalus\alandalus-ululalbaab",
    "C:\Users\itpua\Dev\Work\al-andalus\template-demo"
)

foreach ($repo in $repos) {
    Copy-Item $finalDocx "$repo\public\documents\Surat_Pemberitahuan_Kedatangan.docx" -Force
    Copy-Item $tempPdf "$repo\public\documents\$destName" -Force
}

Write-Host "Redo with Fonts finished successfully!"
