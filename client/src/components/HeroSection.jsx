import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const LEAF_TR = '/assets/leaf-corner-tr.svg';
const LEAF_BL = '/assets/leaf-corner-bl.svg';

export default function HeroSection({ data }) {
  if (!data) return null;

  const titleLines = (data.title || 'Rượu\nMen Lá').split('\n');

  return (
    <section className="hero" id="hero">
      {/* Background image từ Admin, fallback gradient */}
      {data.heroBgUrl ? (
        <div className="hero-bg" style={{ backgroundImage: `url(${data.heroBgUrl})` }} />
      ) : (
        <div className="hero-bg-fallback" />
      )}
      <div className="hero-overlay" />

      {/* Static decorative leaves — không xóa được qua Admin */}
      <img src={LEAF_TR} alt="" aria-hidden="true" className="hero-leaf-tr" />
      <img src={LEAF_BL} alt="" aria-hidden="true" className="hero-leaf-bl" />

      {/* Content */}
      <div className="container" style={{ width: '100%' }}>
        <div className="hero-content">
          {/* Left: Text */}
          <div className="hero-text">
            {/* Title: "Rượu" nhỏ hơn, "Men Lá" cực lớn */}
            <div className="hero-title-script">
              <span className="hero-title-line1">{titleLines[0] || 'Rượu'}</span>
              <span className="hero-title-line2">{titleLines[1] || 'Men Lá'}</span>
            </div>

            {data.subtitle && (
              <p className="hero-subtitle">{data.subtitle}</p>
            )}

            {data.description && (
              <p className="hero-description">{data.description}</p>
            )}

            <div className="hero-cta-group">
              <Link
                to={data.ctaLink || '#san-pham'}
                className="btn btn-primary"
                onClick={(e) => {
                  if ((data.ctaLink || '#san-pham').startsWith('#')) {
                    e.preventDefault();
                    document.querySelector(data.ctaLink || '#san-pham')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {data.ctaText || 'KHÁM PHÁ SẢN PHẨM'} <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Right: Product Image + Side Banner (nếu có riêng qua Admin, còn mặc định đã nằm trong ảnh hero-bg) */}
          <div className="hero-image-wrapper">
            {data.heroProductUrl ? (
              <>
                <img
                  src={data.heroProductUrl}
                  alt="Rượu Men Lá Yến Nhi"
                  className="hero-product-img"
                />
                {data.sideBannerText && (
                  <div className="hero-side-banner">
                    {data.sideBannerText}
                  </div>
                )}
              </>
            ) : !data.heroBgUrl ? (
              <div style={{
                width: 280, height: 380,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '10rem',
                animation: 'float 5s ease-in-out infinite',
                filter: 'drop-shadow(0 20px 40px rgba(38,62,35,0.2))',
              }}>
                🏺
              </div>
            ) : (
              /* Giữ khoảng trống grid để text bên trái không bị tràn sang phải */
              <div style={{ minHeight: 380 }} aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
