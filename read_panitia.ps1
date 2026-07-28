Add-Type -AssemblyName System.IO.Compression.FileSystem
$docPath = 'C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Panitia Welcome Day 2026-2027.docx'
$zip = [System.IO.Compression.ZipFile]::OpenRead($docPath)
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()
$text = [regex]::Replace($xml, '<[^>]+>', ' ')
$text = [regex]::Replace($text, '\s+', ' ')
Write-Output $text.Trim()
