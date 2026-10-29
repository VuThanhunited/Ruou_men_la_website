import { useEffect, useState } from 'react';
import {
  FiPackage,
  FiMessageSquare,
  FiUsers,
  FiCpu,
  FiExternalLink,
  FiFileText,
  FiAward,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const LANDING_URL = import.meta.env.VITE_LANDING_URL || 'http://localhost:5173';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/stats')
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { icon: <FiPackage />, label: 'Sản phẩm', value: stats.products, path: '/products', color: 'var(--color-primary)' },
        { icon: <FiAward />, label: 'Điểm nổi bật (USP)', value: stats.uspFeatures ?? 5, path: '/usp', color: '#059669' },
        { icon: <FiCpu />, label: 'Bước quy trình', value: stats.processSteps, path: '/process', color: '#6366f1' },
        { icon: <FiFileText />, label: 'Bài viết Tin tức', value: stats.news ?? 3, path: '/news', color: '#d97706' },
        { icon: <FiMessageSquare />, label: 'Đánh giá KH', value: stats.testimonials, path: '/testimonials', color: 'var(--color-accent-gold)' },
        { icon: <FiUsers />, label: 'Subscribers', value: stats.subscribers, path: '/subscribers', color: 'var(--color-accent-brown)' },
      ]
    : [];

  const quickActions = [
    { label: '🎨 Tùy chỉnh Giao diện', path: '/theme', desc: 'Đổi bảng màu, font chữ, ẩn/hiện & sắp xếp các phần' },
    { label: '🖼️ Hero, Banner & Logo', path: '/hero', desc: 'Thay Logo, ảnh nền Hero, chum rượu, tiêu đề, hotline' },
    { label: '🏅 Điểm nổi bật (USP)', path: '/usp', desc: 'Thay icon và nội dung 5 điểm nổi bật dưới Hero' },
    { label: '🌿 Banner Giới thiệu', path: '/intro', desc: 'Thay ảnh nền và nội dung phần Tinh hoa Men Lá Việt' },
    { label: '🏺 Quản lý Sản phẩm', path: '/products', desc: 'Thêm, sửa, xóa sản phẩm và hình ảnh sản phẩm' },
    { label: '⚙️ Quy trình Sản xuất', path: '/process', desc: 'Thay ảnh tròn 4 bước quy trình và chi tiết từng bước' },
    { label: '🌄 Câu chuyện Thương hiệu', path: '/brand-story', desc: 'Thay ảnh nền banner rộng và câu chuyện HTX' },
    { label: '📰 Tin tức & Văn hóa', path: '/news', desc: 'Quản lý bài viết tin tức và hình ảnh bìa bài viết' },
    { label: '⭐ Đánh giá Khách hàng', path: '/testimonials', desc: 'Thay ảnh đại diện và nhận xét của khách hàng' },
    { label: '⚙️ Cấu hình & Footer', path: '/site-config', desc: 'Logo Footer, địa chỉ, SĐT, mạng xã hội, SEO' },
  ];

  return (
    <AdminLayout title="Dashboard Quản trị">
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
          flexWrap: 'wrap',
          gap: '1rem',
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
          <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
            Quản lý toàn bộ giao diện, màu sắc, hình ảnh sản phẩm, banner, logo của Landing Page Rượu Men Lá Yến Nhi
          </p>
        </div>
        <a
          href={LANDING_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.18)',
            padding: '0.625rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            color: 'inherit',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <FiExternalLink size={14} /> Xem Trang Client
        </a>
      </div>

      {/* Stats */}
      <div
        className="admin-stats-grid"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
      >
        {loading
          ? Array.from({ length: 6 }, (_, i) => (
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
                <div className="admin-stat-card" style={{ cursor: 'pointer', borderLeftColor: card.color }}>
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
          <div className="admin-panel-title">⚡ Quản lý Giao diện &amp; Hình ảnh nhanh</div>
        </div>
        <div className="admin-panel-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                style={{
                  display: 'block',
                  padding: '1.1rem',
                  background: 'rgba(38,62,35,0.04)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(38,62,35,0.1)',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(38,62,35,0.09)';
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
                    marginBottom: '0.3rem',
                    fontSize: '0.92rem',
                  }}
                >
                  {action.label}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
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
