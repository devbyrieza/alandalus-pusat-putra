Set objWord = CreateObject("Word.Application")
objWord.Visible = False
objWord.DisplayAlerts = 0

Dim docPath, pdfPath
docPath = WScript.Arguments(0)
pdfPath = WScript.Arguments(1)

On Error Resume Next
Set objDoc = objWord.Documents.Open(docPath, False, True) ' Open as read-only
If Err.Number <> 0 Then
    WScript.Echo "Error opening document: " & Err.Description
    objWord.Quit
    WScript.Quit 1
End If

objDoc.ExportAsFixedFormat pdfPath, 17 ' wdExportFormatPDF
If Err.Number <> 0 Then
    WScript.Echo "Error exporting to PDF: " & Err.Description
    objDoc.Close False
    objWord.Quit
    WScript.Quit 1
End If

objDoc.Close False
objWord.Quit
WScript.Echo "Success"
