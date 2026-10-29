import { FiArrowRight } from 'react-icons/fi';

const LEAF_TR = '/assets/leaf-corner-tr.svg';
const LEAF_BL = '/assets/leaf-corner-bl.svg';
const DIVIDER_SVG = '/assets/divider.svg';

export default function BrandStorySection({ data, onOpenCompanyModal, overlayOpacity = 88 }) {
  if (!data) return null;

  const alpha = Math.min(0.98, Math.max(0.3, overlayOpacity / 100));

  return (
    <section className="brand-story" id="gioi-thieu">
      {/* Background image được quản lý qua Admin */}
      {data.storyBgUrl ? (
        <div
          className="brand-story-bg"
          style={{ backgroundImage: `url(${data.storyBgUrl})` }}
        />
      ) : (
        <div
          className="brand-story-bg"
          style={{
            background: 'linear-gradient(135deg, #2d5a27 0%, #1B3018 50%, #0f1e0d 100%)',
          }}
        />
      )}

      {/* Lớp phủ gradient bảo vệ text */}
      <div
        className="brand-story-overlay"
        style={{
          background: `linear-gradient(90deg, transparent 0%, transparent 42%, rgba(18, 35, 21, ${alpha}) 54%, var(--color-primary-dark, #122315) 62%, var(--color-primary-dark, #122315) 100%)`,
        }}
      />
      <div className="brand-story-overlay-top" />

      {/* Static leaf decorations */}
      <img
        src={LEAF_TR}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 200,
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 2,
          transform: 'scaleX(-1)',
        }}
      />
      <img
        src={LEAF_BL}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 160,
          opacity: 0.07,
          pointerEvents: 'none',
          zIndex: 2,
          transform: 'scaleX(-1)',
        }}
      />

      <div className="container" style={{ width: '100%', position: 'relative', zIndex: 3 }}>
        <div className="brand-story-content">
          <span className="brand-story-label">{data.title}</span>

          <img
            src={DIVIDER_SVG}
            alt=""
            aria-hidden="true"
            style={{
              width: 200,
              margin: '0.5rem auto 1rem',
              display: 'block',
              opacity: 0.55,
              filter: 'invert(1) sepia(1) saturate(2) hue-rotate(20deg)',
            }}
          />

          <div className="brand-story-title-script">{data.subTitle}</div>
          <p className="brand-story-description">{data.description}</p>
          <div className="brand-story-btn-wrap">
            <button
              type="button"
              className="btn btn-outline-light"
              onClick={onOpenCompanyModal}
            >
              {data.buttonText || 'VỀ CHÚNG TÔI'} <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
