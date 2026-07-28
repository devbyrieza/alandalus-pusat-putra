$docPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\04-Surat Pemberitahuan Kedatangan Santri Baru 2026-2027-REVISED.docx"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open($docPath)
    Write-Output "--- TEXT CONTENT ---"
    # Print first 1000 characters
    $text = $doc.Content.Text
    if ($text.Length -gt 1000) {
        Write-Output $text.Substring(0, 1000)
    } else {
        Write-Output $text
    }
    Write-Output "--------------------"
}
catch {
    Write-Error $_
}
finally {
    if ($doc) { $doc.Close() }
    $word.Quit()
}
