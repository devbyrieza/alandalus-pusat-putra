$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

$find = $doc.Content.Find
# First, remove the extra paragraph break I added previously.
# In Word, the original was "TEKNIS KEGIATAN WELCOME DAY" followed by a paragraph mark "^p".
# I replaced it with "TEKNIS KEGIATAN WELCOME DAY^p", which resulted in "TEKNIS KEGIATAN WELCOME DAY^p^p".
$success = $find.Execute("TEKNIS KEGIATAN WELCOME DAY^p^p", $false, $false, $false, $false, $false, $true, 1, $false, "TEKNIS KEGIATAN WELCOME DAY^p", 2)

if ($success) {
    Write-Host "Reverted the double enter."
} else {
    Write-Host "Did not find double enter, maybe it was a soft enter?"
    $find.Execute("TEKNIS KEGIATAN WELCOME DAY^l^p", $false, $false, $false, $false, $false, $true, 1, $false, "TEKNIS KEGIATAN WELCOME DAY^p", 2)
}

# Now find the paragraph and set SpaceAfter to 8pt for a small, neat gap!
$paras = $doc.Paragraphs
foreach ($p in $paras) {
    if ($p.Range.Text -match "TEKNIS KEGIATAN WELCOME DAY") {
        $p.SpaceAfter = 8
        Write-Host "Set SpaceAfter to 8pt for the title."
        break
    }
}

$doc.Save()
$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
