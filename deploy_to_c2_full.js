/**
 * DEPLOY TO CLOUD C2 HOSTING (cPanel HTTPS UAPI + FTP Fallback)
 * ==============================================================
 * Máy chủ Cloud C2 Long Vân: https://cpanelhcm2.longvan.net:2083 (IP: 45.119.80.8)
 *
 * Tự động thực hiện:
 * 1. Build Client (client/dist), Admin (admin/dist) và đóng gói server-c2-deploy.zip
 * 2. Đăng nhập cPanel HTTPS API (port 2083) — vượt qua tường lửa chặn passive FTP của Long Vân
 * 3. Tạo thư mục /home/giaiphapqrcode/ruou-men-la/server & /home/giaiphapqrcode/backups/ruou-men-la
 * 4. Upload server-c2-deploy.zip + bản sao lưu 12 bảng Database JSON lên Cloud C2
 * 5. Tự động giải nén (Extract) server-c2-deploy.zip trực tiếp trên Cloud C2
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const CPANEL_CONFIG = {
  host: process.env.C2_CPANEL_HOST || 'cpanelhcm2.longvan.net',
  port: Number(process.env.C2_CPANEL_PORT || 2083),
  user: process.env.C2_FTP_USER || 'giaiphapqrcode',
  password: process.env.C2_FTP_PASS || '',
};

const ROOT = __dirname;
const SERVER_DIR = path.join(ROOT, 'server');
const BACKUP_DIR = path.join(SERVER_DIR, 'backups');
const SERVER_ZIP = path.join(ROOT, 'server-c2-deploy.zip');

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

function httpsRequest(options, bodyBuffer = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: CPANEL_CONFIG.host,
        port: CPANEL_CONFIG.port,
        rejectUnauthorized: false,
        ...options,
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          let json = null;
          try {
            json = JSON.parse(text);
          } catch (_) {}
          resolve({ statusCode: res.statusCode, headers: res.headers, text, json });
        });
      }
    );
    req.on('error', reject);
    if (bodyBuffer) req.write(bodyBuffer);
    req.end();
  });
}

async function loginCpanel() {
  const form = `user=${encodeURIComponent(CPANEL_CONFIG.user)}&pass=${encodeURIComponent(CPANEL_CONFIG.password)}`;
  const body = Buffer.from(form, 'utf8');
  const res = await httpsRequest(
    {
      path: '/login/?login_only=1',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': body.length,
      },
    },
    body
  );

  if (res.statusCode !== 200 || !res.json?.security_token) {
    throw new Error(`Đăng nhập cPanel thất bại (HTTP ${res.statusCode}): ${res.text}`);
  }

  const cookies = (res.headers['set-cookie'] || [])
    .map((c) => c.split(';')[0])
    .filter((c) => c.startsWith('cpsession='))
    .join('; ');

  return {
    token: res.json.security_token,
    cookie: cookies,
  };
}

async function ensureRemoteDir(session, parentDir, dirName) {
  const qs = new URLSearchParams({
    cpanel_jsonapi_apiversion: '2',
    cpanel_jsonapi_module: 'Fileman',
    cpanel_jsonapi_func: 'mkdir',
    path: parentDir,
    name: dirName,
  }).toString();

  await httpsRequest({
    path: `${session.token}/json-api/cpanel?${qs}`,
    method: 'GET',
    headers: { Cookie: session.cookie },
  });
}

async function uploadFileUapi(session, localFilePath, remoteDir) {
  const fileName = path.basename(localFilePath);
  const fileBuffer = fs.readFileSync(localFilePath);
  const boundary = '----cPanelUploadBoundary' + Date.now().toString(16);

  const parts = [];
  const addField = (name, value) => {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
        'utf8'
      )
    );
  };

  addField('dir', remoteDir);
  addField('overwrite', '1');

  parts.push(
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="file-1"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`,
      'utf8'
    )
  );
  parts.push(fileBuffer);
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'));

  const payload = Buffer.concat(parts);

  const res = await httpsRequest(
    {
      path: `${session.token}/execute/Fileman/upload_files`,
      method: 'POST',
      headers: {
        Cookie: session.cookie,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length,
      },
    },
    payload
  );

  if (res.statusCode !== 200 || res.json?.status === 0) {
    throw new Error(`Upload ${fileName} lỗi: ${res.text}`);
  }
  return res.json;
}

async function extractZipApi2(session, zipFullPath, destDir) {
  const qs = new URLSearchParams({
    cpanel_jsonapi_apiversion: '2',
    cpanel_jsonapi_module: 'Fileman',
    cpanel_jsonapi_func: 'fileop',
    op: 'extract',
    sourcefiles: zipFullPath,
    destfiles: destDir,
    doubledecode: '1',
  }).toString();

  const res = await httpsRequest({
    path: `${session.token}/json-api/cpanel?${qs}`,
    method: 'GET',
    headers: { Cookie: session.cookie },
  });

  return res.json;
}

async function main() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'cyan');
  log('║   RƯỢU MEN LÁ – Deploy to Cloud C2 (cPanel HTTPS API)   ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════╝', 'cyan');

  if (!process.argv.includes('--skip-build')) {
    log('\n📦 [1/4] Build Client, Admin và đóng gói Server + Database...', 'yellow');
    execSync('powershell -ExecutionPolicy Bypass -File build-deploy.ps1', {
      cwd: ROOT,
      stdio: 'inherit',
    });
  } else {
    log('\n📦 [1/4] Bỏ qua bước build (--skip-build), dùng gói hiện có...', 'gray');
  }

  if (!CPANEL_CONFIG.password) {
    log('\n❌ Thiếu mật khẩu Cloud C2 (C2_FTP_PASS)!', 'red');
    log('   Chạy: $env:C2_FTP_PASS="matkhau"; node deploy_to_c2_full.js', 'yellow');
    process.exit(1);
  }

  log(`\n🔌 [2/4] Đăng nhập Cloud C2 (${CPANEL_CONFIG.host}:${CPANEL_CONFIG.port})...`, 'yellow');
  const session = await loginCpanel();
  log(`   ✅ Đăng nhập thành công! (Session: ${session.token})`, 'green');

  const homeDir = `/home/${CPANEL_CONFIG.user}`;
  const serverRemoteDir = `${homeDir}/ruou-men-la/server`;
  const backupRemoteDir = `${homeDir}/backups/ruou-men-la`;

  log('\n📁 [3/4] Khởi tạo thư mục & Upload gói Backend + Database lên Cloud C2...', 'cyan');
  await ensureRemoteDir(session, homeDir, 'ruou-men-la');
  await ensureRemoteDir(session, `${homeDir}/ruou-men-la`, 'server');
  await ensureRemoteDir(session, homeDir, 'backups');
  await ensureRemoteDir(session, `${homeDir}/backups`, 'ruou-men-la');

  await uploadFileUapi(session, SERVER_ZIP, serverRemoteDir);
  log(`   ✅ Đã upload: ${serverRemoteDir}/server-c2-deploy.zip`, 'green');

  // Upload trực tiếp .env và .htaccess (vì Compress-Archive có thể bỏ qua dot-files)
  for (const dotFile of ['.env', '.htaccess']) {
    const dotPath = path.join(SERVER_DIR, dotFile);
    if (fs.existsSync(dotPath)) {
      await uploadFileUapi(session, dotPath, serverRemoteDir);
      log(`   ✅ Đã upload cấu hình: ${serverRemoteDir}/${dotFile}`, 'green');
    }
  }

  if (fs.existsSync(BACKUP_DIR)) {
    const backupFiles = fs.readdirSync(BACKUP_DIR).filter((f) => f.endsWith('.json'));
    for (const bf of backupFiles) {
      await uploadFileUapi(session, path.join(BACKUP_DIR, bf), backupRemoteDir);
      log(`   ✅ Đã upload bản sao lưu DB: ${backupRemoteDir}/${bf}`, 'green');
    }
  }

  log('\n📂 [4/4] Giải nén (Extract) gói Backend + Database trên Cloud C2...', 'cyan');
  await extractZipApi2(
    session,
    `${serverRemoteDir}/server-c2-deploy.zip`,
    serverRemoteDir
  );
  // Xóa file zip tạm trên server sau khi giải nén để tiết kiệm dung lượng ổ đĩa C2
  const unlinkQs = new URLSearchParams({
    cpanel_jsonapi_apiversion: '2',
    cpanel_jsonapi_module: 'Fileman',
    cpanel_jsonapi_func: 'fileop',
    op: 'unlink',
    sourcefiles: `${serverRemoteDir}/server-c2-deploy.zip`,
  }).toString();
  await httpsRequest({
    path: `${session.token}/json-api/cpanel?${unlinkQs}`,
    method: 'GET',
    headers: { Cookie: session.cookie },
  });

  const listRes = await httpsRequest({
    path: `${session.token}/execute/Fileman/list_files?dir=${encodeURIComponent(serverRemoteDir)}&show_hidden=1`,
    method: 'GET',
    headers: { Cookie: session.cookie },
  });
  const remoteFiles = (listRes.json?.data || []).map((f) => f.file);
  log(`   ✅ Đã giải nén hoàn tất tại: ${serverRemoteDir}`, 'green');
  log(`   📄 Danh sách file trên Cloud C2: ${remoteFiles.join(', ')}`, 'gray');

  log('\n╔══════════════════════════════════════════════════════════╗', 'green');
  log('║   DEPLOY BACKEND & DATABASE LÊN CLOUD C2 HOÀN TẤT!       ║', 'green');
  log('╚══════════════════════════════════════════════════════════╝', 'green');
  log('\n📋 Đường dẫn trên Cloud C2 (cpanelhcm2.longvan.net / 45.119.80.8):', 'cyan');
  log(`   🗄️  Backend & Local DB: ${serverRemoteDir}`, 'green');
  log(`   💾 Bản sao lưu 12 bảng: ${backupRemoteDir}`, 'green');
}

try {
  require('dotenv').config({ path: path.join(SERVER_DIR, '.env') });
} catch (_) {}

main().catch((err) => {
  log('\n❌ Deploy thất bại: ' + err.message, 'red');
  process.exit(1);
});
