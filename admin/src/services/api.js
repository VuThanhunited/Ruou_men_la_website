import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
      window.location.href = '/login';

    }
    return Promise.reject(err);
  }
);

export default api;
