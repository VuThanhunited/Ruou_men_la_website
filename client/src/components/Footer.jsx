import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import { useState } from 'react';

const LOGO = '/assets/logo.jpg';

const QUICK_LINKS = [
  { label: 'Trang chủ', href: '#hero' },
  { label: 'Giới thiệu', href: '#gioi-thieu' },
  { label: 'Sản phẩm', href: '#san-pham' },
  { label: 'Quy trình', href: '#quy-trinh' },
  { label: 'Tin tức', href: '#tin-tuc' },
  { label: 'Liên hệ', href: '#lien-he' },
];

export default function Footer({ config }) {
  const [email, setEmail] = useState('');

  const handleNav = (e, href) => {
    e.preventDefault();
    if (href && href.startsWith('#') && href.length > 1) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const c = config || {};
  const logo = c.logoUrl || LOGO;
  const name = c.companyName || 'HỢP TÁC XÃ DỊCH VỤ THƯƠNG MẠI YẾN NHI';
  const address = c.address || 'Thôn Tân Đồng, Xã Nam Dương, Thành Phố Bắc Ninh';
  const phone1 = c.phone1 || '0372.477.078';
  const phone2 = c.phone2 || '';
  const emailAddr = c.email || 'yen.nhi.ruoumenla@gmail.com';

  return (
    <footer className="footer" id="lien-he">
      <div className="container">
        <div className="footer-grid">
          {/* COL 1: Brand Logo + Info side-by-side */}
          <div className="footer-brand">
            <div className="footer-brand-layout">
              <div className="footer-logo-wrap">
                <img src={logo} alt="Rượu Men Lá Yến Nhi" />
              </div>
              <div className="footer-brand-info">
                <h3 className="footer-company-name">{name}</h3>
                <ul className="footer-info-list">
                  <li>
                    <span className="icon"><FiMapPin size={14} /></span>
                    <span>{address}</span>
                  </li>
                  <li>
                    <span className="icon"><FiPhone size={14} /></span>
                    <span>
                      <a href={`tel:${phone1}`} style={{ color: 'inherit' }}>{phone1}</a>
                      {phone2 && <> - <a href={`tel:${phone2}`} style={{ color: 'inherit' }}>{phone2}</a></>}
                    </span>
                  </li>
                  <li>
                    <span className="icon"><FiMail size={14} /></span>
                    <a href={`mailto:${emailAddr}`} style={{ color: 'inherit' }}>{emailAddr}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* COL 2: Quick Links */}
          <div className="footer-col-quicklinks">
            <div className="footer-col-title">LIÊN KẾT NHANH</div>
            <ul className="footer-nav-links">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={(e) => handleNav(e, link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3: Newsletter + Social */}
          <div className="footer-col-newsletter">
            <div className="footer-col-title">ĐĂNG KÝ NHẬN TIN</div>
            <p className="footer-newsletter-desc">
              Cập nhật thông tin sản phẩm và ưu đãi mới nhất
            </p>
            <div className="footer-newsletter-form">
              <input
                type="email"
                className="footer-newsletter-input"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="footer-newsletter-btn"
                onClick={() => { if (email) { alert('Cảm ơn bạn đã đăng ký!'); setEmail(''); } }}
                title="Đăng ký"
              >
                <FiSend size={15} />
              </button>
            </div>

            {/* Social Icons: FB, YT, TikTok, Zalo */}
            <div className="footer-social">
              <a href={c.facebookUrl || '#'} target="_blank" rel="noopener noreferrer" title="Facebook">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href={c.youtubeUrl || '#'} target="_blank" rel="noopener noreferrer" title="YouTube">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href={c.tiktokUrl || '#'} target="_blank" rel="noopener noreferrer" title="TikTok">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.79a8.18 8.18 0 004.78 1.52V6.84a4.85 4.85 0 01-1.01-.15z" />
                </svg>
              </a>
              <a href={c.zaloUrl || '#'} target="_blank" rel="noopener noreferrer" title="Zalo"
                style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
                Zalo
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>© 2024 HTX Dịch Vụ Thương Mại Yến Nhi. All rights reserved.</span>
          <span>Thiết kế bởi Yến Nhi Digital</span>
        </div>
      </div>
    </footer>
  );
}
