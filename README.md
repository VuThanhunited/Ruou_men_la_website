# 🍶 Rượu Men Lá Yến Nhi — Landing Page

Hệ thống Landing Page + Admin Panel cho sản phẩm Rượu Men Lá Yến Nhi.

## 📁 Cấu trúc dự án

```
Rượu Men Lá/
├── client/     — Landing Page (React + Vite) · Port 5173
├── admin/      — Trang Quản trị (React + Vite) · Port 5174
└── server/     — Backend API (Node.js + Express) · Port 5000
```

## 🚀 Khởi chạy

### 1. Backend (Server)
```bash
cd server
cp .env.example .env   # Điền MONGODB_URI, JWT_SECRET, Cloudinary keys
npm install
npm run dev            # → http://localhost:5000
```

### 2. Landing Page (Client)
```bash
cd client
cp .env.example .env
npm install
npm run dev            # → http://localhost:5173
```

### 3. Admin Panel
```bash
cd admin
cp .env.example .env
npm install
npm run dev            # → http://localhost:5174/login
```

## 🔑 Tài khoản Admin mặc định

Chạy seeder để tạo tài khoản ban đầu:
```bash
cd server
node utils/seeder.js
# Email: admin@ruoumenla.vn
# Password: Admin@123456
```

## 🌐 URLs

| App | Dev | Production |
|-----|-----|-----------|
| Landing Page | http://localhost:5173 | Vercel |
| Admin Panel | http://localhost:5174 | Vercel (protected) |
| API Server | http://localhost:5000 | Render |

## ⚙️ Tech Stack

- **Frontend**: React + Vite + React Router
- **Admin**: React + Vite + react-easy-crop (Image Cropper .webp)
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Storage**: Cloudinary (ảnh tự động chuyển .webp)
- **Auth**: JWT Token

## 📐 Quy tắc tỷ lệ ảnh (Admin)

| Loại ảnh | Tỷ lệ | CSS Rule |
|---------|-------|----------|
| Logo, Avatar KH, Ảnh bước QT | 1:1 tròn | `border-radius: 50%; object-fit: cover` |
| Ảnh sản phẩm | 1:1 vuông | `aspect-ratio: 1; object-fit: cover` |
| Ảnh nền Hero | 16:9 | `object-fit: cover` |
| Banner Câu chuyện TH | 21:9 | `object-fit: cover` |

> ✅ Mọi ảnh đều được crop đúng tỷ lệ **trước khi upload** qua trình cropper tích hợp.
