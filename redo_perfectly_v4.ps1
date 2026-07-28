git checkout 86da8d8 -- "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
Copy-Item "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx" "temp_clean.docx" -Force
git restore "04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"

Add-Type -AssemblyName System.IO.Compression.FileSystem
$tempDir = "$env:TEMP\docx_extract_redo_v4"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
[System.IO.Compression.ZipFile]::ExtractToDirectory("C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\temp_clean.docx", $tempDir)

$xmlPath = "$tempDir\word\document.xml"
[xml]$xml = [System.IO.File]::ReadAllText($xmlPath, [System.Text.Encoding]::UTF8)

$wNamespace = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace("w", $wNamespace)

# Update fonts for EXISTING runs ONLY to avoid schema violations
$rFontsNodes = $xml.SelectNodes("//w:rFonts", $ns)
foreach ($rFonts in $rFontsNodes) {
    $run = $rFonts.ParentNode.ParentNode
    $tNode = $run.SelectSingleNode("w:t", $ns)
    if ($tNode -ne $null) {
        $runText = $tNode.InnerText
        if ($runText -match "[\u0600-\u06FF]") {
            $rFonts.SetAttribute("ascii", $wNamespace, "Sakkal Majalla")
            $rFonts.SetAttribute("hAnsi", $wNamespace, "Sakkal Majalla")
            $rFonts.SetAttribute("cs", $wNamespace, "Sakkal Majalla")
            
            # Update existing sz and szCs if they exist
            $sz = $rFonts.ParentNode.SelectSingleNode("w:sz", $ns)
            if ($sz -ne $null) { $sz.SetAttribute("val", $wNamespace, "28") } # 14pt
            $szCs = $rFonts.ParentNode.SelectSingleNode("w:szCs", $ns)
            if ($szCs -ne $null) { $szCs.SetAttribute("val", $wNamespace, "28") }
        } else {
            $rFonts.SetAttribute("ascii", $wNamespace, "Calibri")
            $rFonts.SetAttribute("hAnsi", $wNamespace, "Calibri")
            $rFonts.SetAttribute("cs", $wNamespace, "Calibri")
        }
    }
}

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
            $tNodes = $para.SelectNodes(".//w:t", $ns)
            foreach ($t in $tNodes) {
                if ($t.InnerText -match "Santri yang membawa") {
                    $t.InnerText = "Begitu tiba di pesantren, santri dan wali santri langsung menurunkan barang bawaan, kemudian mobil diarahkan ke area parkir."
                }
            }
        }
        elseif ($text -match "^5\.") {
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
    
    if ($text -match "Sukabumi" -or $text -match "28 Juni" -or $text -match "Mudir" -or $text -match "Wahab Rajasam") {
        $pPr = $para.SelectSingleNode("w:pPr", $ns)
        if ($pPr -eq $null) {
            $pPr = $xml.CreateElement("w", "pPr", $wNamespace)
            $para.PrependChild($pPr) | Out-Null
        }
        $jc = $pPr.SelectSingleNode("w:jc", $ns)
        if ($jc -eq $null) {
            $jc = $xml.CreateElement("w", "jc", $wNamespace)
            $pPr.AppendChild($jc) | Out-Null
        }
        $jc.SetAttribute("val", $wNamespace, "right")
        
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

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($xmlPath, $xml.OuterXml, $utf8NoBom)

$finalDocx = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"
if (Test-Path $finalDocx) { Remove-Item $finalDocx -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $finalDocx)

$tempPdf = "$env:TEMP\Surat_Pemberitahuan_Kedatangan.pdf"
if (Test-Path $tempPdf) { Remove-Item $tempPdf -Force -ErrorAction SilentlyContinue }

Stop-Process -Name WINWORD -Force -ErrorAction SilentlyContinue
cscript //nologo convert.vbs $finalDocx $tempPdf

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

Write-Host "Success v4!"
