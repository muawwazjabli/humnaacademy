$destDrive = "j:\My Drive\hamna academy\humna-academy-website-complete.zip"
$destDownloads = "c:\Users\jabli\Downloads\humna-academy-website-complete.zip"

if (Test-Path $destDrive) { Remove-Item $destDrive -Force }
if (Test-Path $destDownloads) { Remove-Item $destDownloads -Force }

$tempDir = Join-Path $env:TEMP ("humna_export_" + [System.Guid]::NewGuid().ToString().Substring(0,8))
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

$items = Get-ChildItem -Path . -Exclude "node_modules", ".next", ".git", ".env.local", "*.zip", "scripts"
foreach ($item in $items) {
    Copy-Item -Path $item.FullName -Destination $tempDir -Recurse -Force
}

# Also include scripts/setup-admin.mjs
$scriptsDir = Join-Path $tempDir "scripts"
New-Item -ItemType Directory -Path $scriptsDir -Force | Out-Null
Copy-Item -Path "scripts\setup-admin.mjs" -Destination $scriptsDir -Force

Compress-Archive -Path "$tempDir\*" -DestinationPath $destDrive -Force
Copy-Item -Path $destDrive -Destination $destDownloads -Force

Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Success! Created Zip Files:"
Get-Item $destDrive | Select-Object FullName, Length, LastWriteTime | Format-List
Get-Item $destDownloads | Select-Object FullName, Length, LastWriteTime | Format-List
