$htmlFile = "file:///J:/My%20Drive/hamna%20academy/website/scripts/guide-manual.html"
$destDownloads = "C:\Users\jabli\Downloads\humna-academy-operations-manual.pdf"
$destDrive = "J:\My Drive\hamna academy\humna-academy-operations-manual.pdf"
$destPublic = "J:\My Drive\hamna academy\website\public\humna-academy-operations-manual.pdf"

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

$proc = Start-Process -FilePath $edgePath -ArgumentList @(
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--print-to-pdf=$destDownloads",
    $htmlFile
) -Wait -PassThru

Start-Sleep -Seconds 2

if (Test-Path $destDownloads) {
    Copy-Item -Path $destDownloads -Destination $destDrive -Force
    Copy-Item -Path $destDownloads -Destination $destPublic -Force
    Write-Host "SUCCESS: PDF created at $destDownloads and $destDrive"
    Get-Item $destDownloads | Format-List
} else {
    Write-Host "FAILED: Output not found."
}
