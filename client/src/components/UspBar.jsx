import React from 'react';

export default function UspBar({ features = [] }) {
  if (!features.length) return null;

  const isImageUrl = (icon) => {
    if (typeof icon !== 'string') return false;
    return icon.startsWith('/') || icon.startsWith('http') || /\.(svg|png|jpg|webp)$/i.test(icon);
  };

  return (
    <section className="usp-bar">
      <div className="container">
        <div className="usp-bar-inner">
          {features.map((item, idx) => (
            <React.Fragment key={item._id || idx}>
              <div className="usp-item">
                <div className="usp-icon">
                  {isImageUrl(item.icon) ? (
                    <img src={item.icon} alt={item.title} className="usp-icon-img" />
                  ) : (
                    item.icon
                  )}
                </div>
                <div className="usp-title">{item.title}</div>
                {item.subtitle && <div className="usp-subtitle">{item.subtitle}</div>}
              </div>
              {idx < features.length - 1 && (
                <div className="usp-divider" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
