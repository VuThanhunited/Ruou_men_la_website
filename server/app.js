/**
 * app.js - Entry point cho Phusion Passenger trên Cloud C2 (cPanel Setup Node.js App)
 * Passenger tự quản lý port/socket nên file này export `app` mà không gọi app.listen()
 */

'use strict';

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', new Date().toISOString(), err.message, err.stack);
});
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', new Date().toISOString(), reason);
});

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('express-async-errors');

const connectDB = require('./config/db');
const seed = require('./utils/seeder');
const runBackupToC2 = require('./scripts/backup_to_c2');

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');

const app = express();

// ===========================
// MIDDLEWARE
// ===========================
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Phục vụ thư mục ảnh uploads trên Cloud C2
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// ===========================
// HEALTH CHECK & ROUTES
// ===========================
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, ts: Date.now(), uptime: Math.round(process.uptime()) });
});

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected_mongodb' : 'local_json_c2';
  res.json({
    status: 'OK',
    db: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    nodeVersion: process.version,
  });
});

app.get('/', (req, res) =>
  res.json({ message: '🍶 Rượu Men Lá API (Cloud C2) đang chạy!' })
);

app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);

// ===========================
// GLOBAL ERROR HANDLER
// ===========================
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]', err.stack || err.message);
  if (!res.headersSent) {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Lỗi server nội bộ',
    });
  }
});

// ===========================
// INITIALIZE DB & AUTO-BACKUP ON C2
// ===========================
(async () => {
  try {
    await connectDB();
    await seed();
    // Đồng bộ bản sao xuống ổ cứng Cloud C2 (server/data/local-db.json)
    await runBackupToC2();
    // Định kỳ 24h đồng bộ lại 1 lần
    setInterval(() => {
      runBackupToC2().catch((e) => console.warn('[Auto Sync C2]', e.message));
    }, 24 * 60 * 60 * 1000);
  } catch (err) {
    console.error('⚠️ Khởi tạo DB gặp lỗi (hệ thống vẫn chạy qua local-db.json):', err.message);
  }
})();

module.exports = app;
