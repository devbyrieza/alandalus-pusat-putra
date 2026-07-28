$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open('C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\clean_fixed.docx')

$find = $doc.Content.Find
# ^p is the paragraph mark in Word Find/Replace
$success = $find.Execute("TEKNIS KEGIATAN WELCOME DAY", $false, $false, $false, $false, $false, $true, 1, $false, "TEKNIS KEGIATAN WELCOME DAY^p", 2)
if ($success) {
    Write-Host "Successfully added enter after TEKNIS KEGIATAN WELCOME DAY!"
} else {
    Write-Host "Failed to find the text!"
}

$doc.Save()
$doc.Close([ref]0)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
