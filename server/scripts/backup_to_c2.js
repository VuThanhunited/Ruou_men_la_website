/**
 * BACKUP & SYNC DATABASE TO CLOUD C2
 * ====================================
 * 1. Xuất toàn bộ 12 bảng dữ liệu từ MongoDB ra:
 *    - server/data/local-db.json (dùng trực tiếp làm DB nội bộ trên ổ cứng C2)
 *    - server/backups/backup_YYYY-MM-DD.json (bản lưu lịch sử)
 * 2. Tự động upload lên Cloud C2 qua FTP nếu có cấu hình C2_FTP_PASS
 */

'use strict';
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Admin = require('../models/Admin');
const {
  Hero,
  UspFeature,
  Intro,
  Product,
  Process,
  ProcessStep,
  BrandStory,
  News,
  Testimonial,
  SiteConfig,
  Subscriber,
} = require('../models/Content');

const DATA_DIR = path.join(__dirname, '..', 'data');
const LOCAL_DB_FILE = path.join(DATA_DIR, 'local-db.json');
const BACKUP_DIR = path.join(__dirname, '..', 'backups');

const FTP_CONFIG = {
  host: process.env.C2_FTP_HOST || 'giaiphapqrcode.vn',
  user: process.env.C2_FTP_USER || 'giaiphapqrcode',
  password: process.env.C2_FTP_PASS || '',
  port: 21,
  secure: false,
};

const REMOTE_BACKUP_DIR = '/backups/ruou-men-la/';

async function exportAllCollections() {
  const [
    admins,
    heros,
    uspFeatures,
    intros,
    products,
    processes,
    processSteps,
    brandStories,
    news,
    testimonials,
    siteConfigs,
    subscribers,
  ] = await Promise.all([
    Admin.find().select('+password').lean(),
    Hero.find().lean(),
    UspFeature.find().sort('order').lean(),
    Intro.find().lean(),
    Product.find().sort('order').lean(),
    Process.find().lean(),
    ProcessStep.find().sort('stepNumber').lean(),
    BrandStory.find().lean(),
    News.find().sort('order').lean(),
    Testimonial.find().sort('order').lean(),
    SiteConfig.find().lean(),
    Subscriber.find().lean(),
  ]);

  // Định dạng tương thích trực tiếp với server/config/jsonStore.js
  const storePayload = {
    Admin: admins,
    Hero: heros,
    UspFeature: uspFeatures,
    Intro: intros,
    Product: products,
    Process: processes,
    ProcessStep: processSteps,
    BrandStory: brandStories,
    News: news,
    Testimonial: testimonials,
    SiteConfig: siteConfigs,
    Subscriber: subscribers,
  };

  return storePayload;
}

async function runBackupToC2() {
  let ownConnection = false;
  try {
    if (mongoose.connection.readyState !== 1) {
      const connectDB = require('../config/db');
      const connected = await connectDB();
      ownConnection = connected;
    }

    const storePayload = await exportAllCollections();

    // 1. Lưu trực tiếp vào server/data/local-db.json
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(storePayload, null, 2), 'utf-8');

    // 2. Lưu bản backup theo ngày vào server/backups/
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    const dateStr = new Date().toISOString().slice(0, 10);
    const backupFileName = `ruou_men_la_backup_${dateStr}.json`;
    const backupFilePath = path.join(BACKUP_DIR, backupFileName);
    fs.writeFileSync(
      backupFilePath,
      JSON.stringify(
        {
          exportDate: new Date().toISOString(),
          system: 'Rượu Men Lá Yến Nhi - Cloud C2 Database Snapshot',
          counts: Object.fromEntries(
            Object.entries(storePayload).map(([k, v]) => [k, Array.isArray(v) ? v.length : 0])
          ),
          data: storePayload,
        },
        null,
        2
      ),
      'utf-8'
    );

    console.log(`✅ [DB Sync] Đã đồng bộ 12 bảng dữ liệu vào ${LOCAL_DB_FILE}`);

    // 3. Nếu có cấu hình C2_FTP_PASS thì đẩy bản backup lên FTP C2
    if (FTP_CONFIG.password) {
      try {
        const { Client } = require('basic-ftp');
        const ftp = new Client();
        await ftp.access(FTP_CONFIG);
        await ftp.ensureDir(REMOTE_BACKUP_DIR);
        await ftp.uploadFrom(backupFilePath, REMOTE_BACKUP_DIR + backupFileName);
        ftp.close();
        console.log(`✅ [C2 FTP Backup] Đã upload ${backupFileName} lên Cloud C2`);
      } catch (ftpErr) {
        console.warn(`⚠️ [C2 FTP Backup] Không thể upload FTP: ${ftpErr.message}`);
      }
    }

    return true;
  } catch (err) {
    console.error('❌ [DB Sync Error]:', err.message);
    return false;
  } finally {
    if (ownConnection && mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

if (require.main === module) {
  runBackupToC2().then((ok) => process.exit(ok ? 0 : 1));
}

module.exports = runBackupToC2;
