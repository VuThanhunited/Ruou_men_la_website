const dns = require('dns');
const mongoose = require('mongoose');

// Khắc phục lỗi Windows DNS từ chối truy vấn SRV của mongodb+srv://
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // ignore
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'ruou-men-la',
      serverSelectionTimeoutMS: 20000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Không kết nối được MongoDB (${error.message}).`);
    console.warn(
      '👉 Đang sử dụng cơ sở dữ liệu JSON nội bộ (server/data/local-db.json) để hệ thống hoạt động bình thường.'
    );
    return false;
  }
};

module.exports = connectDB;
