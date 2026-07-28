$pdfPath = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents\CETAK KOP SURAT VERSI 1 DAN 2.pdf"
$outDir = "C:\Users\itpua\Dev\Work\al-andalus\alandalus-alimam\public\documents"

$code = @"
using System;
using System.IO;
using System.Threading.Tasks;
using Windows.Storage;
using Windows.Data.Pdf;
using Windows.Storage.Streams;

public class PdfRenderer {
    public static void RenderPdf(string pdfPath, string outDir) {
        RenderPdfAsync(pdfPath, outDir).GetAwaiter().GetResult();
    }

    private static async Task RenderPdfAsync(string pdfPath, string outDir) {
        StorageFile file = await StorageFile.GetFileFromPathAsync(pdfPath);
        PdfDocument pdf = await PdfDocument.LoadFromFileAsync(file);
        
        for (uint i = 0; i < pdf.PageCount; i++) {
            using (PdfPage page = pdf.GetPage(i)) {
                string outPath = Path.Combine(outDir, $"kop_page_{i + 1}.png");
                StorageFile outFile = await StorageFolder.GetFolderFromPathAsync(outDir)
                    .CreateFileAsync($"kop_page_{i + 1}.png", CreationCollisionOption.ReplaceExisting);
                
                using (IRandomAccessStream stream = await outFile.OpenAsync(FileAccessMode.ReadWrite)) {
                    await page.RenderToStreamAsync(stream);
                    await stream.FlushAsync();
                }
            }
        }
    }
}
"@

# Load Windows Runtime assemblies
[void][System.Reflection.Assembly]::LoadWithPartialName("System.Runtime.WindowsRuntime")
$SystemRuntime = [System.IO.Path]::Combine([System.Runtime.InteropServices.RuntimeEnvironment]::GetRuntimeDirectory(), "System.Runtime.dll")

Add-Type -TypeDefinition $code -ReferencedAssemblies @(
    "System.Runtime.WindowsRuntime",
    "System.Threading.Tasks",
    $SystemRuntime,
    "C:\Windows\System32\WinMetadata\Windows.Foundation.winmd",
    "C:\Windows\System32\WinMetadata\Windows.Storage.winmd",
    "C:\Windows\System32\WinMetadata\Windows.Data.winmd"
) -ErrorAction SilentlyContinue

try {
    [PdfRenderer]::RenderPdf($pdfPath, $outDir)
    Write-Host "Success rendering PDF pages to PNG!"
    Get-ChildItem $outDir -Filter "kop_page_*.png" | ForEach-Object {
        Write-Host "Created: $($_.Name) - $($_.Length) bytes"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Inner: $($_.Exception.InnerException.Message)"
}
