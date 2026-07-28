$word = New-Object -ComObject Word.Application
$word.Visible = $false

# 1. Surat Pernyataan
$srcSP = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Surat_Pernyataan_Orangtua_Wali (1).docx"
$destSP = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Draft_Surat_Pernyataan.docx"
Copy-Item $srcSP $destSP -Force
$docSP = $word.Documents.Open($destSP)

$find1 = "SURAT PERNYATAAN ORANGTUA/WALI SANTRI"
$rep1 = "SURAT PERNYATAAN DAN KOMITMEN ORANG TUA/WALI SANTRI"
$word.Selection.HomeKey(6)
$word.Selection.Find.Execute($find1, $false, $false, $false, $false, $false, $true, 1, $false, $rep1, 2)

$find2 = "Sebagai orangtua/wali dari calon santri/santriwati:"
$rep2 = "Sebagai orang tua/wali dari calon santri/santriwati:"
$word.Selection.HomeKey(6)
$word.Selection.Find.Execute($find2, $false, $false, $false, $false, $false, $true, 1, $false, $rep2, 2)

$find3 = "Maka kami menyatakan bersedia dengan ikhlas apabila putra/putri kami dikembalikan kepada kami hingga benar-benar dinyatakan pulih dan layak untuk kembali tinggal di lingkungan Pesantren, yang dibuktikan dengan surat keterangan dari psikolog atau tenaga ahli yang berwenang."
$rep3 = "Maka kami menyatakan bersedia menerima keputusan dan tindakan pembinaan yang ditetapkan oleh Pesantren sesuai dengan jenis dan tingkat pelanggaran yang dilakukan, termasuk apabila putra/putri kami harus dikembalikan sementara kepada orang tua/wali. Apabila berdasarkan pertimbangan Pesantren diperlukan pemeriksaan atau pendampingan oleh psikolog maupun tenaga ahli yang berwenang, kami bersedia mengikuti ketentuan tersebut sebagai salah satu bahan pertimbangan untuk menentukan kelayakan putra/putri kami kembali tinggal di lingkungan Pesantren."
$word.Selection.HomeKey(6)
$word.Selection.Find.Execute($find3, $false, $false, $false, $false, $false, $true, 1, $false, $rep3, 2)

$find4 = "Catatan mengenai kondisi kesehatan:"
$rep4 = "Pernyataan mengenai kondisi kesehatan:"
$word.Selection.HomeKey(6)
$word.Selection.Find.Execute($find4, $false, $false, $false, $false, $false, $true, 1, $false, $rep4, 2)

$docSP.Save()
$docSP.Close()

# 2. Pakta Integritas
$srcPI = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\Pakta_Integritas_Santri_dan_Orangtua (2).docx"
$destPI = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\Draft_Pakta_Integritas.docx"
Copy-Item $srcPI $destPI -Force
$docPI = $word.Documents.Open($destPI)

$find5 = "selama saya menjadi santri"
$rep5 = "selama menjadi santri"
$word.Selection.HomeKey(6)
$word.Selection.Find.Execute($find5, $false, $false, $false, $false, $false, $true, 1, $false, $rep5, 2)

$find6 = "menyatakan bahwa saya akan:"
$rep6 = "saya menyatakan bahwa saya akan:"
$word.Selection.HomeKey(6)
$word.Selection.Find.Execute($find6, $false, $false, $false, $false, $false, $true, 1, $false, $rep6, 2)

$docPI.Save()
$docPI.Close()

$word.Quit()
