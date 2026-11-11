$rootDir   = "d:\WorkFreelancer\Rượu Men Lá"
$clientDir = Join-Path $rootDir "client"
$adminDir  = Join-Path $rootDir "admin"
$serverDir = Join-Path $rootDir "server"
$outputZip = Join-Path $rootDir "server-c2-deploy.zip"

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  Rượu Men Lá – Build Deploy Package for Cloud C2    " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Build Client & Admin
Write-Host "  [1/3] Building Client (client/dist)..." -ForegroundColor Yellow
Push-Location $clientDir
npm run build
if (Test-Path (Join-Path $clientDir "public\.htaccess")) {
    Copy-Item (Join-Path $clientDir "public\.htaccess") (Join-Path $clientDir "dist\.htaccess") -Force
}
Pop-Location

Write-Host "  [2/3] Building Admin (admin/dist)..." -ForegroundColor Yellow
Push-Location $adminDir
npm run build
if (Test-Path (Join-Path $adminDir "public\.htaccess")) {
    Copy-Item (Join-Path $adminDir "public\.htaccess") (Join-Path $adminDir "dist\.htaccess") -Force
}
Pop-Location

# 2. Đồng bộ dữ liệu local-db.json mới nhất
Write-Host "  [3/3] Packaging Server ZIP (server-c2-deploy.zip)..." -ForegroundColor Yellow

if (Test-Path $outputZip) {
    Remove-Item $outputZip -Force
}

$include = @(
    "app.js",          # Entry point cho Phusion Passenger (cPanel Cloud C2)
    "index.js",        # Entry point cho PM2 / local dev
    "package.json",    # Dependencies
    ".env",            # Environment variables
    ".htaccess",       # Phusion Passenger config
    "config",          # DB, Cloudinary, JSON Store
    "controllers",     # API controllers
    "middleware",      # Auth middleware
    "models",          # Mongoose schemas
    "routes",          # Express routes
    "utils",           # Database seeder
    "scripts",         # C2 Backup & Sync scripts
    "data",            # local-db.json (toàn bộ 12 bảng dữ liệu trên C2)
    "backups",         # Bản sao lưu JSON
    "uploads"          # Ảnh đã tải lên
)

$tempDir = Join-Path $env:TEMP "ruou-men-la-c2-deploy"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

foreach ($item in $include) {
    $src = Join-Path $serverDir $item
    $dst = Join-Path $tempDir $item

    if (Test-Path $src) {
        if ((Get-Item $src).PSIsContainer) {
            Copy-Item $src $dst -Recurse -Force
            Write-Host "  [DIR]  $item/" -ForegroundColor Green
        } else {
            Copy-Item $src $dst -Force
            Write-Host "  [FILE] $item" -ForegroundColor Green
        }
    } else {
        Write-Host "  [SKIP] $item" -ForegroundColor DarkGray
    }
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $outputZip -CompressionLevel Optimal
Remove-Item $tempDir -Recurse -Force

$zipSizeKB = [math]::Round((Get-Item $outputZip).Length / 1KB, 1)
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "  DONE: $outputZip ($zipSizeKB KB)" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Hướng dẫn đưa lên Cloud C2 (cPanel):" -ForegroundColor Cyan
Write-Host "    1. Upload tự động Client & Admin qua FTP:" -ForegroundColor White
Write-Host "       `$env:C2_FTP_HOST='ten-mien-c2.vn'; `$env:C2_FTP_USER='user_c2'; `$env:C2_FTP_PASS='matkhau'; node deploy_to_c2_full.js" -ForegroundColor Gray
Write-Host "    2. Cài đặt Backend Node.js trên cPanel Cloud C2:" -ForegroundColor White
Write-Host "       - cPanel -> File Manager -> /home/<user>/nodeapp/ -> Upload server-c2-deploy.zip -> Extract" -ForegroundColor Gray
Write-Host "       - cPanel -> Setup Node.js App -> Application startup file: app.js -> Run NPM Install -> Restart" -ForegroundColor Gray
Write-Host ""
