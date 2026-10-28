import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../services/api';
import '../styles/Admin.css';


export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('adminToken', res.data.data.token);
      localStorage.setItem('adminName', res.data.data.name);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '2rem',
            }}
          >
            🏺
          </div>
          <div className="admin-login-title">Yến Nhi Admin</div>
          <div className="admin-login-sub">Quản trị nội dung Landing Page</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          <div className="admin-form-group">
            <label className="admin-form-label">
              <FiMail size={14} /> Email
            </label>
            <input
              type="email"
              className="admin-form-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@ruoumenla.vn"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">
              <FiLock size={14} /> Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                className="admin-form-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                style={{ paddingRight: '2.5rem', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                }}
              >
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}


