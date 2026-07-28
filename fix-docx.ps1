$word = New-Object -ComObject Word.Application
$word.Visible = $false

$destSP = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Draft_Surat_Pernyataan.docx"
$docSP = $word.Documents.Open($destSP)

$word.Selection.HomeKey(6)
$word.Selection.Find.Execute("Maka kami menyatakan bersedia dengan ikhlas", $false, $false, $false, $false, $false, $true, 1, $false, "", 0)
if ($word.Selection.Find.Found) {
    $word.Selection.MoveEndUntil("")
    $word.Selection.Text = "Maka kami menyatakan bersedia menerima keputusan dan tindakan pembinaan yang ditetapkan oleh Pesantren sesuai dengan jenis dan tingkat pelanggaran yang dilakukan, termasuk apabila putra/putri kami harus dikembalikan sementara kepada orang tua/wali. Apabila berdasarkan pertimbangan Pesantren diperlukan pemeriksaan atau pendampingan oleh psikolog maupun tenaga ahli yang berwenang, kami bersedia mengikuti ketentuan tersebut sebagai salah satu bahan pertimbangan untuk menentukan kelayakan putra/putri kami kembali tinggal di lingkungan Pesantren."
}

$docSP.Save()
$docSP.Close()
$word.Quit()
