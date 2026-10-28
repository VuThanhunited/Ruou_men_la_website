import { FiArrowRight } from 'react-icons/fi';

const DIVIDER_SVG = '/assets/divider.svg';

export default function SplitSection({ intro, products = [] }) {
  return (
    <section className="split-section" id="san-pham">
      {/* LEFT: Intro banner xanh đậm */}
      <div className="intro-banner" id="gioi-thieu">
        {intro?.introBgUrl ? (
          <div
            className="intro-banner-bg"
            style={{ backgroundImage: `url(${intro.introBgUrl})` }}
          />
        ) : (
          <div className="intro-banner-bg" style={{
            background: 'linear-gradient(160deg, #1a3318 0%, #2d5426 50%, #3a6b30 100%)',
          }} />
        )}
        <div className="intro-banner-overlay" />

        <div className="intro-banner-content">
          <div className="intro-title-script">
            {(intro?.title || 'Tinh hoa\nMen Lá Việt').split('\n').map((line, i) => (
              <span key={i} style={{ display: 'block' }}>{line}</span>
            ))}
          </div>

          <p className="intro-description">
            {intro?.description || 'Rượu Men Lá Yến Nhi là sự kết hợp hài hòa giữa bí quyết dân gian và nguồn nguyên liệu thiên nhiên, mang đến hương vị độc đáo, đậm đà bản sắc quê hương.'}
          </p>

          <a
            href={intro?.buttonLink || '#'}
            className="btn btn-outline-light"
            onClick={(e) => {
              const link = intro?.buttonLink || '#gioi-thieu';
              if (link.startsWith('#')) {
                e.preventDefault();
                document.querySelector(link)?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {intro?.buttonText || 'TÌM HIỂU NGAY'} <FiArrowRight />
          </a>
        </div>
      </div>

      {/* RIGHT: Products */}
      <div className="products-section">
        <div className="products-header">
          <div className="products-header-flourish">
            <svg width="32" height="22" viewBox="0 0 32 22" fill="none">
              <path d="M16 11C12.5 4 4.5 2 2.5 8.5C0.5 15 8.5 18 16 11Z" fill="#3A6332" opacity="0.9" />
              <path d="M16 11C19.5 4 27.5 2 29.5 8.5C31.5 15 23.5 18 16 11Z" fill="#3A6332" opacity="0.9" />
              <circle cx="16" cy="11" r="1.8" fill="#C59B5F" />
            </svg>
          </div>
          <h2 className="section-title products-title">
            SẢN PHẨM NỔI BẬT
          </h2>
        </div>

        <div className="products-grid">
          {products.map((product, idx) => (
            <div key={product._id || idx} className="product-card">
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
                  <button className="product-card-btn">XEM CHI TIẾT</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
