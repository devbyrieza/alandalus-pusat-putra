$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

try {
    $file = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\file dari media\003-Surat Undangan Welcome Day Pesantren Al Imam Al Islami.docx"
    if (Test-Path $file) {
        $doc = $word.Documents.Open($file)
        Write-Host "=== FILE: $(Split-Path $file -Leaf) ==="
        for ($i = 1; $i -le $doc.Paragraphs.Count; $i++) {
            $text = $doc.Paragraphs.Item($i).Range.Text.Trim()
            if ($text) {
                Write-Host "$($i): $text"
            }
        }
        $doc.Close()
    } else {
        Write-Host "File not found: $file"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
} finally {
    $word.Quit()
}
