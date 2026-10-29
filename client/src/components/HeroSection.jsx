import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const LEAF_TR = '/assets/leaf-corner-tr.svg';
const LEAF_BL = '/assets/leaf-corner-bl.svg';

export default function HeroSection({ data, overlayOpacity = 85 }) {
  if (!data) return null;

  const titleLines = (data.title || 'Rượu\nMen Lá').split('\n');
  const alphaStart = Math.min(0.95, Math.max(0.2, overlayOpacity / 100));
  const alphaMid = Math.max(0.15, alphaStart - 0.2);

  return (
    <section className="hero" id="hero">
      {/* Background image từ Admin, fallback gradient */}
      {data.heroBgUrl ? (
        <div className="hero-bg" style={{ backgroundImage: `url(${data.heroBgUrl})` }} />
      ) : (
        <div className="hero-bg-fallback" />
      )}
      <div
        className="hero-overlay"
        style={{
          background: `linear-gradient(95deg, rgba(245,239,224,${alphaStart}) 0%, rgba(245,239,224,${alphaMid}) 36%, rgba(245,239,224,0.22) 56%, rgba(245,239,224,0.0) 74%)`,
        }}
      />

      {/* Static decorative leaves */}
      <img src={LEAF_TR} alt="" aria-hidden="true" className="hero-leaf-tr" />
      <img src={LEAF_BL} alt="" aria-hidden="true" className="hero-leaf-bl" />

      {/* Content */}
      <div className="container" style={{ width: '100%' }}>
        <div className="hero-content">
          {/* Left: Text */}
          <div className="hero-text">
            <div className="hero-title-script">
              <span className="hero-title-line1">{titleLines[0] || 'Rượu'}</span>
              <span className="hero-title-line2">{titleLines[1] || 'Men Lá'}</span>
            </div>

            {data.subtitle && <p className="hero-subtitle">{data.subtitle}</p>}

            {data.description && <p className="hero-description">{data.description}</p>}

            <div className="hero-cta-group">
              <Link
                to={data.ctaLink || '#san-pham'}
                className="btn btn-primary"
                onClick={(e) => {
                  const target = data.ctaLink || '#san-pham';
                  if (target.startsWith('#')) {
                    e.preventDefault();
                    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {data.ctaText || 'KHÁM PHÁ SẢN PHẨM'} <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Right: Product Image + Side Banner */}
          <div className="hero-image-wrapper">
            {data.heroProductUrl ? (
              <>
                <img
                  src={data.heroProductUrl}
                  alt="Rượu Men Lá Yến Nhi"
                  className="hero-product-img"
                />
                {(data.sideBannerText || data.sideBannerBgUrl) && (
                  <div
                    className="hero-side-banner"
                    style={
                      data.sideBannerBgUrl
                        ? {
                            backgroundImage: `url(${data.sideBannerBgUrl})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }
                        : undefined
                    }
                  >
                    {data.sideBannerText}
                  </div>
                )}
              </>
            ) : data.sideBannerBgUrl ? (
              <div
                className="hero-side-banner"
                style={{
                  position: 'relative',
                  right: 0,
                  top: 0,
                  transform: 'none',
                  backgroundImage: `url(${data.sideBannerBgUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {data.sideBannerText}
              </div>
            ) : !data.heroBgUrl ? (
              <div
                style={{
                  width: 280,
                  height: 380,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10rem',
                  animation: 'float 5s ease-in-out infinite',
                  filter: 'drop-shadow(0 20px 40px rgba(38,62,35,0.2))',
                }}
              >
                🏺
              </div>
            ) : (
              <div style={{ minHeight: 380 }} aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
