import { useEffect, useState } from 'react';
import { FiPackage, FiMessageSquare, FiUsers, FiCpu, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { icon: <FiPackage />, label: 'Sản phẩm', value: stats.products, path: '/', color: 'var(--color-primary)' },
        { icon: <FiMessageSquare />, label: 'Đánh giá', value: stats.testimonials, path: '/', color: 'var(--color-accent-gold)' },
        { icon: <FiUsers />, label: 'Subscribers', value: stats.subscribers, path: '/', color: 'var(--color-accent-brown)' },
        { icon: <FiCpu />, label: 'Bước quy trình', value: stats.processSteps, path: '/', color: '#6366f1' },
      ]
    : [];

  const quickActions = [
    { label: 'Cập nhật Hero', path: '/', desc: 'Logo, ảnh nền, tiêu đề, hotline' },
    { label: 'Quản lý sản phẩm', path: '/', desc: 'Thêm, sửa, xóa sản phẩm' },
    { label: 'Đánh giá KH', path: '/', desc: 'Thêm phản hồi khách hàng' },
    { label: 'Câu chuyện TH', path: '/', desc: 'Cập nhật nội dung banner story' },
    { label: 'Cấu hình chung', path: '/', desc: 'Footer, địa chỉ, mạng xã hội' },
    { label: 'Quy trình SX', path: '/', desc: 'Quản lý 4 bước sản xuất' },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Welcome */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          color: 'var(--color-text-light)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '2rem',
              marginBottom: '0.25rem',
            }}
          >
            Chào mừng trở lại! 🍶
          </h1>
          <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
            Quản lý toàn bộ nội dung Landing Page Rượu Men Lá Yến Nhi
          </p>
        </div>
        <Link
          to="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.15)',
            padding: '0.625rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            color: 'inherit',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <FiExternalLink size={14} /> Xem Landing Page
        </Link>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        {loading
          ? Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="admin-stat-card">
                <div className="skeleton" style={{ width: 52, height: 52, borderRadius: 8 }} />
                <div>
                  <div className="skeleton" style={{ width: 60, height: 32, marginBottom: 4 }} />
                  <div className="skeleton" style={{ width: 100, height: 14 }} />
                </div>
              </div>
            ))
          : statCards.map((card) => (
              <Link key={card.path} to={card.path} style={{ textDecoration: 'none' }}>
                <div className="admin-stat-card" style={{ cursor: 'pointer' }}>
                  <div className="admin-stat-icon" style={{ background: `${card.color}18` }}>
                    <span style={{ color: card.color, fontSize: '1.5rem' }}>{card.icon}</span>
                  </div>
                  <div>
                    <div className="admin-stat-value" style={{ color: card.color }}>
                      {card.value}
                    </div>
                    <div className="admin-stat-label">{card.label}</div>
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-panel-card">
        <div className="admin-panel-header">
          <div className="admin-panel-title">⚡ Thao tác nhanh</div>
        </div>
        <div className="admin-panel-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
            }}
          >
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                style={{
                  display: 'block',
                  padding: '1rem',
                  background: 'rgba(38,62,35,0.04)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(38,62,35,0.08)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(38,62,35,0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(38,62,35,0.04)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    marginBottom: '0.25rem',
                    fontSize: '0.9rem',
                  }}
                >
                  {action.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  {action.desc}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


