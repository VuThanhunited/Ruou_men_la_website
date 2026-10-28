import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  FiHome, FiImage, FiStar, FiPackage,
  FiSettings, FiMessageSquare, FiUsers,
  FiLogOut, FiUser, FiCpu, FiAward, FiExternalLink,
} from 'react-icons/fi';
import '../styles/Admin.css';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
  {
    section: 'Nội dung trang',
    items: [
      { label: 'Hero & Navbar',        icon: <FiImage />,        path: '/hero' },
      { label: 'Điểm nổi bật (USP)',   icon: <FiAward />,        path: '/usp' },
      { label: 'Giới thiệu',           icon: <FiUser />,         path: '/intro' },
      { label: 'Sản phẩm',             icon: <FiPackage />,      path: '/products' },
      { label: 'Quy trình SX',         icon: <FiCpu />,          path: '/process' },
      { label: 'Câu chuyện TH',        icon: <FiStar />,         path: '/brand-story' },
      { label: 'Đánh giá KH',          icon: <FiMessageSquare />, path: '/testimonials' },
    ],
  },
  {
    section: 'Cài đặt',
    items: [
      { label: 'Cấu hình chung',  icon: <FiSettings />, path: '/site-config' },
      { label: 'Subscribers',     icon: <FiUsers />,    path: '/subscribers' },
    ],
  },
];

// URL trang Landing Page (client chạy port 5173)
const LANDING_URL = import.meta.env.VITE_LANDING_URL || 'http://localhost:5173';

export default function AdminLayout({ children, title = 'Dashboard' }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/login');
  };

  const adminName = localStorage.getItem('adminName') || 'Admin';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-brand-icon">YN</div>
          <div>
            <div className="admin-sidebar-brand-text">Yến Nhi Admin</div>
            <div className="admin-sidebar-brand-sub">Quản trị nội dung</div>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map((item, idx) => {
            if (item.section) {
              return (
                <div key={idx}>
                  <div className="admin-nav-section">{item.section}</div>
                  {item.items.map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      className={`admin-nav-item ${pathname === sub.path ? 'active' : ''}`}
                    >
                      <span className="admin-nav-icon">{sub.icon}</span>
                      {sub.label}
                    </Link>
                  ))}
                </div>
              );
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${pathname === item.path ? 'active' : ''}`}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FiLogOut /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">{title}</div>
          <div className="admin-topbar-user">
            <FiUser size={16} />
            <span>{adminName}</span>
            <a
              href={LANDING_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.78rem',
                color: 'var(--color-primary)',
                marginLeft: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <FiExternalLink size={12} /> Xem trang web
            </a>
          </div>
        </div>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
