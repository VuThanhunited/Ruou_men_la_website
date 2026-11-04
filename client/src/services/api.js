import axios from 'axios';

const envApiUrl = (import.meta.env.VITE_API_URL || '').trim();
// Nếu đang chạy production (Vercel / Hosting C4 Nginx) và chưa cấu hình hoặc vẫn trỏ Render cũ,
// dùng đường dẫn tương đối '/api' để proxy thẳng về Hosting C4 (http://45.119.214.68:5001/api)
const useRelativeProxy =
  import.meta.env.PROD && (!envApiUrl || envApiUrl.includes('onrender.com'));

const rawBaseUrl = useRelativeProxy
  ? '/api'
  : (envApiUrl || 'http://localhost:5000/api').replace(/\/+$/, '');

const baseURL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Tự động gắn token cho admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto redirect khi token hết hạn
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem('adminToken')) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;
