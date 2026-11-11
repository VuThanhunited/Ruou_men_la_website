$rootDir   = $PSScriptRoot
$clientDir = Join-Path $rootDir "client"
$adminDir  = Join-Path $rootDir "admin"
$serverDir = Join-Path $rootDir "server"
$outputZip = Join-Path $rootDir "server-c2-deploy.zip"

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  Ruou Men La - Build Deploy Package for Cloud C2    " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Build Client & Admin
Write-Host "  [1/3] Building Client (client/dist)..." -ForegroundColor Yellow
Push-Location -LiteralPath $clientDir
npm run build
$clientHtaccess = Join-Path $clientDir "public\.htaccess"
if (Test-Path -LiteralPath $clientHtaccess) {
    Copy-Item -LiteralPath $clientHtaccess -Destination (Join-Path $clientDir "dist\.htaccess") -Force
}
Pop-Location

Write-Host "  [2/3] Building Admin (admin/dist)..." -ForegroundColor Yellow
Push-Location -LiteralPath $adminDir
npm run build
$adminHtaccess = Join-Path $adminDir "public\.htaccess"
if (Test-Path -LiteralPath $adminHtaccess) {
    Copy-Item -LiteralPath $adminHtaccess -Destination (Join-Path $adminDir "dist\.htaccess") -Force
}
Pop-Location

# 2. Packaging Server ZIP
Write-Host "  [3/3] Packaging Server ZIP (server-c2-deploy.zip)..." -ForegroundColor Yellow

if (Test-Path -LiteralPath $outputZip) {
    Remove-Item -LiteralPath $outputZip -Force
}

$include = @(
    "app.js",
    "index.js",
    "package.json",
    ".env",
    ".htaccess",
    "config",
    "controllers",
    "middleware",
    "models",
    "routes",
    "utils",
    "scripts",
    "data",
    "backups",
    "uploads"
)

$tempDir = Join-Path $env:TEMP "ruou-men-la-c2-deploy"
if (Test-Path -LiteralPath $tempDir) { Remove-Item -LiteralPath $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

foreach ($item in $include) {
    $src = Join-Path $serverDir $item
    $dst = Join-Path $tempDir $item

    if (Test-Path -LiteralPath $src) {
        if ((Get-Item -LiteralPath $src).PSIsContainer) {
            Copy-Item -LiteralPath $src -Destination $dst -Recurse -Force
            Write-Host "  [DIR]  $item/" -ForegroundColor Green
        } else {
            Copy-Item -LiteralPath $src -Destination $dst -Force
            Write-Host "  [FILE] $item" -ForegroundColor Green
        }
    } else {
        Write-Host "  [SKIP] $item" -ForegroundColor DarkGray
    }
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $outputZip -CompressionLevel Optimal
Remove-Item -LiteralPath $tempDir -Recurse -Force

$zipSizeKB = [math]::Round((Get-Item -LiteralPath $outputZip).Length / 1KB, 1)
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "  DONE: $outputZip ($zipSizeKB KB)" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
