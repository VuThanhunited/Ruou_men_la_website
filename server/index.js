require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('express-async-errors');

const connectDB = require('./config/db');
const seed = require('./utils/seeder');

// Routes
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');

const app = express();

// ===========================
// MIDDLEWARE
// ===========================
app.use(helmet({ crossOriginResourcePolicy: false }));

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((s) => s.trim()) : []),
  ...(process.env.ADMIN_URL ? process.env.ADMIN_URL.split(',').map((s) => s.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Phục vụ file upload tĩnh (Local Fallback khi chưa cấu hình Cloudinary)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===========================
// ROUTES
// ===========================
app.get('/', (req, res) => res.json({ message: '🍶 Rượu Men Lá API đang chạy!' }));
app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);

// ===========================
// GLOBAL ERROR HANDLER
// ===========================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Lỗi server nội bộ',
  });
});

// ===========================
// START SERVER
// ===========================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seed();
  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên port ${PORT}`);
    console.log(`📊 Admin API: http://localhost:${PORT}/api`);
  });
};

startServer();
