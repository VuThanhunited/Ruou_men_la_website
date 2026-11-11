const dns = require('dns');
const mongoose = require('mongoose');

// Khắc phục lỗi Windows DNS từ chối truy vấn SRV của mongodb+srv://
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // ignore
}

const buildDirectFallbackUri = (srvUri) => {
  if (!srvUri || !srvUri.startsWith('mongodb+srv://') || !srvUri.includes('clj0q4i.mongodb.net')) {
    return null;
  }
  const credsMatch = srvUri.match(/^mongodb\+srv:\/\/([^@]+)@/);
  if (!credsMatch) return null;
  return `mongodb://${credsMatch[1]}@ac-8j7eell-shard-00-00.clj0q4i.mongodb.net:27017,ac-8j7eell-shard-00-01.clj0q4i.mongodb.net:27017,ac-8j7eell-shard-00-02.clj0q4i.mongodb.net:27017/ruou-men-la?ssl=true&authSource=admin&retryWrites=true&w=majority`;
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️ Chưa cấu hình MONGODB_URI — sử dụng cơ sở dữ liệu JSON nội bộ (server/data/local-db.json).');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'ruou-men-la',
      serverSelectionTimeoutMS: 20000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return true;
  } catch (error) {
    const fallbackUri = buildDirectFallbackUri(uri);
    if (fallbackUri) {
      try {
        console.warn('⚠️ SRV DNS bị chặn trên hosting, thử kết nối Direct Shard URI...');
        const conn = await mongoose.connect(fallbackUri, {
          dbName: 'ruou-men-la',
          serverSelectionTimeoutMS: 20000,
        });
        console.log(`✅ MongoDB Direct Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
        return true;
      } catch (fallbackErr) {
        console.warn(`⚠️ Direct Shard kết nối thất bại (${fallbackErr.message}).`);
      }
    }

    console.warn(`⚠️ Không kết nối được MongoDB (${error.message}).`);
    console.warn(
      '👉 Đang sử dụng cơ sở dữ liệu JSON nội bộ (server/data/local-db.json) trên ổ cứng C2 để hệ thống hoạt động bình thường.'
    );
    return false;
  }
};

module.exports = connectDB;
