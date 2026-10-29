import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiKey,
  FiAlertCircle,
} from 'react-icons/fi';
import api from '../services/api';
import '../styles/Admin.css';

export default function AdminLoginPage() {
  const [form, setForm] = useState({
    email: 'admin@ruoumenla.vn',
    password: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleQuickFill = () => {
    setForm({
      email: 'admin@ruoumenla.vn',
      password: 'Admin@123456',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('adminToken', res.data.data.token);
      localStorage.setItem('adminName', res.data.data.name);
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError('Không kết nối được tới máy chủ API (Port 5000). Vui lòng kiểm tra Server đang chạy.');
      } else {
        setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Nền ảnh mờ + họa tiết lá */}
      <div
        className="admin-login-bg"
        style={{ backgroundImage: "url('/assets/hero-bg.jpg')" }}
      />
      <div className="admin-login-overlay" />

      <div className="admin-login-wrapper">
        {/* Cột trái: Brand Showcase */}
        <div className="admin-login-showcase">
          <div
            className="admin-login-showcase-bg"
            style={{ backgroundImage: "url('/assets/brand-story-bg.jpg')" }}
          />
          <div className="admin-login-showcase-overlay" />

          <div className="admin-login-showcase-content">
            <div className="admin-login-brand-top">
              <div className="admin-login-logo-ring">
                <img src="/assets/logo.jpg" alt="Rượu Men Lá Yến Nhi" />
              </div>
              <span className="admin-login-coop-badge">
                HTX DỊCH VỤ THƯƠNG MẠI YẾN NHI
              </span>
            </div>

            <div className="admin-login-brand-middle">
              <h1 className="admin-login-script-title">Rượu Men Lá</h1>
              <p className="admin-login-brand-tagline">
                Hương vị truyền thống từ núi rừng quê hương
              </p>
              <div className="admin-login-gold-divider" />
              <ul className="admin-login-feature-list">
                <li>
                  <FiCheckCircle className="feature-icon" />
                  <span>Tùy chỉnh bảng màu, font chữ &amp; bố cục giao diện tự do</span>
                </li>
                <li>
                  <FiCheckCircle className="feature-icon" />
                  <span>Thay thế Logo, Banner, Ảnh sản phẩm &amp; Quy trình dễ dàng</span>
                </li>
                <li>
                  <FiCheckCircle className="feature-icon" />
                  <span>Đồng bộ thời gian thực với trang Landing Page Client</span>
                </li>
              </ul>
            </div>

            <div className="admin-login-brand-footer">
              © 2026 Hệ thống Quản trị Nội dung Yến Nhi Digital
            </div>
          </div>
        </div>

        {/* Cột phải: Form Đăng nhập */}
        <div className="admin-login-form-side">
          <div className="admin-login-form-header">
            <span className="admin-login-portal-tag">CỔNG QUẢN TRỊ HỆ THỐNG</span>
            <h2 className="admin-login-heading">Đăng nhập Admin</h2>
            <p className="admin-login-desc">
              Nhập thông tin tài khoản quản trị viên để quản lý giao diện &amp; nội dung
            </p>
          </div>

          {error && (
            <div className="admin-login-error">
              <FiAlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-login-field">
              <label className="admin-login-label">Địa chỉ Email</label>
              <div className="admin-login-input-wrap">
                <span className="admin-login-input-icon">
                  <FiMail size={17} />
                </span>
                <input
                  type="email"
                  className="admin-login-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@ruoumenla.vn"
                  required
                />
              </div>
            </div>

            <div className="admin-login-field">
              <label className="admin-login-label">Mật khẩu quản trị</label>
              <div className="admin-login-input-wrap">
                <span className="admin-login-input-icon">
                  <FiLock size={17} />
                </span>
                <input
                  type={showPw ? 'text' : 'password'}
                  className="admin-login-input has-toggle"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Nhập mật khẩu..."
                  required
                />
                <button
                  type="button"
                  className="admin-login-pw-toggle"
                  onClick={() => setShowPw(!showPw)}
                  title={showPw ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPw ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
            </div>

            {/* Hộp gợi ý tài khoản mặc định & nút điền nhanh */}
            <div className="admin-login-quickfill">
              <div className="admin-login-quickfill-info">
                <FiKey size={14} className="key-icon" />
                <span>
                  Mặc định: <strong>admin@ruoumenla.vn</strong> / <strong>Admin@123456</strong>
                </span>
              </div>
              <button
                type="button"
                className="admin-login-quickfill-btn"
                onClick={handleQuickFill}
              >
                Điền nhanh
              </button>
            </div>

            <button
              type="submit"
              className="admin-login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span>Đang xác thực...</span>
              ) : (
                <>
                  <span>ĐĂNG NHẬP HỆ THỐNG</span>
                  <FiArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
