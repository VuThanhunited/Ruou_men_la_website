import { AiFillStar } from 'react-icons/ai';

// Divider trang trí tĩnh — cố định trong source code, không quản lý qua Admin
const DIVIDER_SVG = '/assets/divider.svg';

function StarRating({ rating = 5 }) {
  return (
    <div className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <AiFillStar
          key={i}
          style={{ color: i < rating ? 'var(--color-accent-gold)' : '#e5e7eb' }}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection({ testimonials = [] }) {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="section-title testimonials-title">
            KHÁCH HÀNG NÓI VỀ YẾN NHI
          </h2>
          <div className="testimonials-header-flourish">
            <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
              <path d="M14 9C10.5 3 3.5 1 1.5 7C-0.5 13 6.5 15 14 9Z" fill="#C59B5F" opacity="0.8" />
              <path d="M14 9C17.5 3 24.5 1 26.5 7C28.5 13 21.5 15 14 9Z" fill="#C59B5F" opacity="0.8" />
              <circle cx="14" cy="9" r="1.5" fill="#3A6332" />
            </svg>
          </div>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((item) => (
            <div key={item._id} className="testimonial-card">
              <div className="testimonial-quote-icon">“</div>
              <p className="testimonial-comment">{item.comment}</p>

              <div className="testimonial-bottom-row">
                <div className="testimonial-customer">
                  <div className="testimonial-avatar">
                    {item.avatarUrl ? (
                      <img
                        src={item.avatarUrl}
                        alt={item.customerName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div className="testimonial-avatar-placeholder">
                        {item.customerName?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="testimonial-meta">
                    <div className="testimonial-name">{item.customerName}</div>
                    <div className="testimonial-location">{item.location}</div>
                  </div>
                </div>
                <StarRating rating={item.rating} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
