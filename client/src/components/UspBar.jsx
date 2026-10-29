import React from 'react';

export default function UspBar({ features = [] }) {
  if (!features.length) return null;

  const isImageUrl = (icon) => {
    if (typeof icon !== 'string' || !icon) return false;
    return (
      icon.startsWith('/') ||
      icon.startsWith('http') ||
      icon.startsWith('data:') ||
      /\.(svg|png|jpg|jpeg|webp|gif)$/i.test(icon)
    );
  };

  return (
    <section className="usp-bar">
      <div className="container">
        <div className="usp-bar-inner">
          {features.map((item, idx) => {
            const iconSrc = item.iconUrl || item.icon || '/assets/icons/usp-nature.svg';
            const sub = item.subTitle || item.subtitle || '';
            return (
              <React.Fragment key={item._id || idx}>
                <div className="usp-item">
                  <div className="usp-icon">
                    {isImageUrl(iconSrc) ? (
                      <img src={iconSrc} alt={item.title} className="usp-icon-img" />
                    ) : (
                      iconSrc
                    )}
                  </div>
                  <div className="usp-title">{item.title}</div>
                  {sub && <div className="usp-subtitle">{sub}</div>}
                </div>
                {idx < features.length - 1 && <div className="usp-divider" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
