import { FiArrowRight } from 'react-icons/fi';

export default function SplitSection({
  intro,
  products = [],
  showIntro = true,
  onOpenAbout,
  onSelectProduct,
}) {
  const bannerBg = intro?.introBannerUrl || intro?.introBgUrl || '/assets/intro-bg.jpg';

  return (
    <section
      className="split-section"
      id="san-pham"
      style={!showIntro ? { gridTemplateColumns: '1fr' } : undefined}
    >
      {/* LEFT: Intro banner */}
      {showIntro && (
        <div className="intro-banner">
          {bannerBg ? (
            <div
              className="intro-banner-bg"
              style={{ backgroundImage: `url(${bannerBg})` }}
            />
          ) : (
            <div
              className="intro-banner-bg"
              style={{
                background: 'linear-gradient(160deg, #1a3318 0%, #2d5426 50%, #3a6b30 100%)',
              }}
            />
          )}
          <div className="intro-banner-overlay" />

          <div className="intro-banner-content">
            <div className="intro-title-script">
              {(intro?.title || 'Tinh hoa\nMen Lá Việt').split('\n').map((line, i) => (
                <span key={i} style={{ display: 'block' }}>
                  {line}
                </span>
              ))}
            </div>

            <p className="intro-description">
              {intro?.description ||
                'Rượu Men Lá Yến Nhi là sự kết hợp hài hòa giữa bí quyết dân gian và nguồn nguyên liệu thiên nhiên, mang đến hương vị độc đáo, đậm đà bản sắc quê hương.'}
            </p>

            <button
              type="button"
              className="btn btn-outline-light"
              onClick={() => {
                if (onOpenAbout) {
                  onOpenAbout();
                } else {
                  document.querySelector('#gioi-thieu')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              {intro?.buttonText || 'TÌM HIỂU NGAY'} <FiArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* RIGHT: Products */}
      <div className="products-section">
        <div className="products-header">
          <div className="products-header-flourish">
            <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
              <path
                d="M16 11C12.5 4 4.5 2 2.5 8.5C0.5 15 8.5 18 16 11Z"
                fill="var(--color-primary)"
                opacity="0.9"
              />
              <path
                d="M16 11C19.5 4 27.5 2 29.5 8.5C31.5 15 23.5 18 16 11Z"
                fill="var(--color-primary)"
                opacity="0.9"
              />
              <circle cx="16" cy="11" r="1.8" fill="var(--color-accent-gold)" />
            </svg>
          </div>
          <h2 className="section-title products-title">SẢN PHẨM NỔI BẬT</h2>
        </div>

        <div className="products-grid">
          {products.map((product, idx) => (
            <div
              key={product._id || idx}
              className="product-card"
              onClick={() => onSelectProduct && onSelectProduct(product)}
              style={{ cursor: 'pointer' }}
            >
              <div className="product-card-img-wrap">
                {product.thumbnailUrl ? (
                  <img
                    src={product.thumbnailUrl}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div className="product-card-placeholder">🏺</div>
                )}
              </div>
              <div className="product-card-body">
                <div className="product-card-name">{product.name}</div>
                <div className="product-card-volume">{product.volume}</div>
                <div className="product-card-btn-wrap">
                  <button
                    type="button"
                    className="product-card-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectProduct) onSelectProduct(product);
                    }}
                  >
                    XEM CHI TIẾT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
