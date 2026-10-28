import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiPhone, FiMenu, FiX } from 'react-icons/fi';
import '../styles/Navbar.css';

const NAV_LINKS = [
  { label: 'Trang chủ', href: '#hero' },
  { label: 'Giới thiệu', href: '#gioi-thieu' },
  { label: 'Sản phẩm', href: '#san-pham' },
  { label: 'Quy trình', href: '#quy-trinh' },
  { label: 'Tin tức', href: '#tin-tuc' },
  { label: 'Liên hệ', href: '#lien-he' },
];

const LOGO = '/assets/logo.jpg';

export default function Navbar({ hotline = '0866.603.589' }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      // ScrollSpy to highlight the right nav item
      const sections = ['#hero', '#san-pham', '#quy-trinh', '#gioi-thieu', '#tin-tuc', '#lien-he'];
      const scrollPos = window.scrollY + 180;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.querySelector(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    setActiveSection(href);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : 'transparent'}`}>
        <div className="container">
          <div className="navbar-inner">
            {/* Logo */}
            <a href="#hero" onClick={(e) => handleNav(e, '#hero')} className="navbar-logo">
              <img src={LOGO} alt="Rượu Men Lá Yến Nhi" />
            </a>

            {/* Desktop Nav */}
            <ul className="navbar-nav">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNav(e, link.href)}
                    className={activeSection === link.href ? 'active' : ''}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Hotline Pill Button */}
            <a href={`tel:${hotline}`} className="navbar-hotline">
              <span className="navbar-hotline-icon">
                <FiPhone size={13} />
              </span>
              <span className="navbar-hotline-text">
                <span className="navbar-hotline-label">Hotline</span>
                <span className="navbar-hotline-number">{hotline}</span>
              </span>
            </a>

            {/* Mobile Toggle */}
            <button
              className="navbar-mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Mở menu"
            >
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <img src={LOGO} alt="Logo" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>
            <FiX />
          </button>
        </div>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={(e) => handleNav(e, link.href)}>
            {link.label}
          </a>
        ))}
        <a href={`tel:${hotline}`} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          <FiPhone size={16} /> {hotline}
        </a>
      </div>
    </>
  );
}
