require('dotenv').config();
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
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

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
