import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const STEP_EMOJIS = ['🌾', '🌿', '🏺', '✨'];
const LEAF_TR = '/assets/leaf-corner-tr.svg';
const LEAF_BL = '/assets/leaf-corner-bl.svg';

export default function ProcessSection({ section, steps = [], onOpenProcessModal }) {
  return (
    <section className="process-section" id="quy-trinh">
      {/* Static leaf decorations */}
      <img src={LEAF_TR} alt="" aria-hidden="true" style={{
        position: 'absolute', top: 0, right: 0, width: 220,
        opacity: 0.09, pointerEvents: 'none', zIndex: 0,
      }} />
      <img src={LEAF_BL} alt="" aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, width: 180,
        opacity: 0.07, pointerEvents: 'none', zIndex: 0,
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="process-section-inner">
          {/* LEFT: Text */}
          <div className="process-text-block">
            <div className="process-section-label">
              {section?.sectionTitle || 'QUY TRÌNH SẢN XUẤT'}
            </div>
            <div className="process-section-title">
              {section?.sectionSubtitle || 'Giữ trọn hương vị tự nhiên'}
            </div>
            <p className="process-section-desc">
              {section?.sectionDescription || 'Rượu Men Lá Yến Nhi được làm từ gạo nếp chọn lọc, men lá rừng truyền thống, ủ thủ công theo bí quyết dân gian, đảm bảo hương vị thuần khiết và an toàn cho sức khỏe.'}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onOpenProcessModal && onOpenProcessModal(1)}
            >
              {section?.buttonText || 'XEM CHI TIẾT QUY TRÌNH'} <FiArrowRight />
            </button>
          </div>

          {/* RIGHT: Steps với mũi tên */}
          <div className="process-steps-block">
            <div className="process-steps-grid">
              {steps.map((step, idx) => (
                <div key={step._id || idx} style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div
                    className="process-step"
                    onClick={() => onOpenProcessModal && onOpenProcessModal(step.stepNumber || idx + 1)}
                    style={{ cursor: 'pointer' }}
                    title={`Bấm để xem chi tiết Bước ${step.stepNumber}: ${step.title}`}
                  >
                    {/* Ảnh tròn cố định 1:1 */}
                    <div className="process-step-img-wrap">
                      {step.imageUrl ? (
                        <img
                          src={step.imageUrl}
                          alt={step.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <div className="process-step-placeholder">
                          {STEP_EMOJIS[idx % STEP_EMOJIS.length]}
                        </div>
                      )}
                    </div>
                    <div className="process-step-number">{step.stepNumber}</div>
                    <div className="process-step-title">{step.title}</div>
                    {step.subtitle && (
                      <div className="process-step-subtitle">{step.subtitle}</div>
                    )}
                  </div>

                  {/* Mũi tên tĩnh giữa các bước */}
                  {idx < steps.length - 1 && (
                    <div className="process-arrow">
                      <svg width="36" height="16" viewBox="0 0 36 16" fill="none">
                        <line x1="0" y1="8" x2="28" y2="8" stroke="#C59B5F" strokeWidth="2" strokeLinecap="round"/>
                        <polyline points="22,2 32,8 22,14" stroke="#C59B5F" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
