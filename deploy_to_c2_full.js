/**
 * DEPLOY TO CLOUD C2 HOSTING - FULL SCRIPT (RƯỢU MEN LÁ)
 * =====================================================
 * 1. Upload client/dist  → /public_html/             (Trang chủ Rượu Men Lá)
 * 2. Upload admin/dist   → /public_html/admin-panel/ (Trang quản trị Admin)
 * 3. Upload DB Backup    → /backups/ruou-men-la/     (Bản sao lưu 12 bảng dữ liệu)
 * 4. Tạo server ZIP      → server-c2-deploy.zip      (Upload qua cPanel Node.js App)
 *
 * Cách dùng:
 *   $env:C2_FTP_HOST="domain_hoac_ip_c2"
 *   $env:C2_FTP_USER="tentaikhoan_cpanel"
 *   $env:C2_FTP_PASS="matkhau_cpanel"
 *   node deploy_to_c2_full.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FTP_CONFIG = {
  host: process.env.C2_FTP_HOST || 'giaiphapqrcode.com',
  user: process.env.C2_FTP_USER || 'giaiphapqrcode',
  password: process.env.C2_FTP_PASS || '',
  port: Number(process.env.C2_FTP_PORT || 21),
  secure: false,
};

const ROOT = __dirname;
const CLIENT_DIST = path.join(ROOT, 'client', 'dist');
const ADMIN_DIST = path.join(ROOT, 'admin', 'dist');
const SERVER_DIR = path.join(ROOT, 'server');
const BACKUP_DIR = path.join(SERVER_DIR, 'backups');
const SERVER_ZIP = path.join(ROOT, 'server-c2-deploy.zip');

const REMOTE_CLIENT_ROOT = process.env.C2_REMOTE_CLIENT || '/public_html/';
const REMOTE_ADMIN_ROOT = process.env.C2_REMOTE_ADMIN || '/public_html/admin-panel/';
const REMOTE_BACKUP_ROOT = '/backups/ruou-men-la/';

function countFiles(dir) {
  let count = 0;
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) count += countFiles(full);
    else count++;
  }
  return count;
}

function log(msg, color = 'reset') {
  const colors = {
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    gray: '\x1b[90m',
    reset: '\x1b[0m',
  };
  console.log((colors[color] || '') + msg + colors.reset);
}

async function buildAllPackages() {
  log('\n📦 Đang build Client, Admin và đóng gói Server ZIP cho Cloud C2...', 'yellow');
  execSync('powershell -ExecutionPolicy Bypass -File build-deploy.ps1', {
    cwd: ROOT,
    stdio: 'inherit',
  });
  log('   ✅ Đã tạo gói Server C2: ' + SERVER_ZIP, 'green');
}

async function ftpUpload(ftp, localDir, remoteDir, label) {
  log('\n🚀 Upload ' + label + '...', 'cyan');
  log('   Local:  ' + localDir, 'gray');
  log('   Remote: ftp://' + FTP_CONFIG.host + remoteDir, 'gray');
  const total = countFiles(localDir);
  log('   Files:  ' + total, 'gray');
  const start = Date.now();
  await ftp.ensureDir(remoteDir);
  await ftp.uploadFromDir(localDir, remoteDir);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  log('   ✅ Xong! (' + elapsed + 's, ' + total + ' files)', 'green');
}

async function main() {
  log('\n╔════════════════════════════════════════════════════╗', 'cyan');
  log('║   RƯỢU MEN LÁ – Deploy to Cloud C2 Hosting (FTP)   ║', 'cyan');
  log('╚════════════════════════════════════════════════════╝', 'cyan');

  await buildAllPackages();

  if (!FTP_CONFIG.password) {
    log('\nℹ️  Đã đóng gói xong toàn bộ bộ cài đặt cho Cloud C2!', 'green');
    log('   - Gói Backend + Database C2: ' + SERVER_ZIP, 'cyan');
    log('   - Bản build Client (kèm .htaccess): ' + CLIENT_DIST, 'cyan');
    log('   - Bản build Admin (kèm .htaccess):  ' + ADMIN_DIST, 'cyan');
    log('\n👉 Để tự động đẩy thẳng lên FTP Cloud C2, hãy chạy:', 'yellow');
    log('   $env:C2_FTP_HOST="ten_mien_c2"; $env:C2_FTP_USER="user_c2"; $env:C2_FTP_PASS="matkhau"; node deploy_to_c2_full.js', 'gray');
    process.exit(0);
  }

  let Client;
  try {
    ({ Client } = require('basic-ftp'));
  } catch {
    ({ Client } = require(path.join(SERVER_DIR, 'node_modules', 'basic-ftp')));
  }

  const ftp = new Client();
  ftp.ftp.verbose = false;

  try {
    log('\n🔌 Kết nối FTP tới Cloud C2: ' + FTP_CONFIG.host + '...', 'yellow');
    await ftp.access(FTP_CONFIG);
    log('   ✅ Kết nối FTP thành công!', 'green');

    await ftpUpload(ftp, CLIENT_DIST, REMOTE_CLIENT_ROOT, 'Client Landing Page (Rượu Men Lá)');
    await ftpUpload(ftp, ADMIN_DIST, REMOTE_ADMIN_ROOT, 'Admin Panel (Trang quản trị)');

    if (fs.existsSync(BACKUP_DIR)) {
      await ftpUpload(ftp, BACKUP_DIR, REMOTE_BACKUP_ROOT, 'Database Backup (12 Collections JSON)');
    }

    log('\n╔══════════════════════════════════════════════════════╗', 'green');
    log('║   DEPLOY LÊN CLOUD C2 HOÀN THÀNH!                    ║', 'green');
    log('╚══════════════════════════════════════════════════════╝', 'green');
    log('\n📋 Kết quả:', 'cyan');
    log('   🌐 Trang chủ:   https://' + FTP_CONFIG.host, 'green');
    log('   🔧 Quản trị:    https://' + FTP_CONFIG.host + '/admin-panel', 'green');
    log('\n⚠️  Bước kích hoạt Node.js App trên cPanel Cloud C2:', 'yellow');
    log('   1. cPanel → File Manager → /home/' + FTP_CONFIG.user + '/nodeapp/', 'gray');
    log('   2. Upload & Extract file: ' + SERVER_ZIP, 'gray');
    log('   3. Setup Node.js App → Startup file: app.js → Run NPM Install → Restart', 'gray');
  } catch (err) {
    log('\n❌ Upload FTP thất bại: ' + err.message, 'red');
    process.exit(1);
  } finally {
    ftp.close();
  }
}

try {
  require('dotenv').config({ path: path.join(SERVER_DIR, '.env') });
} catch (_) {}

main();
