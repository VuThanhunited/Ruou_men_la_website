import React, { useEffect, useState } from 'react';
import { FiX, FiCalendar, FiClock, FiShare2 } from 'react-icons/fi';
import '../styles/News.css';

const extractImageUrl = (text) => {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  const tagMatch = trimmed.match(/^\[IMG:(.+)\]$/i);
  if (tagMatch) return tagMatch[1].trim();
  if (/^(https?:\/\/|\/uploads\/|\/assets\/).+\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(trimmed)) {
    return trimmed;
  }
  return null;
};

export default function NewsModal({ article, onClose }) {
  const [zoomImg, setZoomImg] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (zoomImg) setZoomImg(null);
        else onClose();
      }
    };
    if (article) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [article, onClose, zoomImg]);

  if (!article) return null;

  const coverUrl = article.imageUrl || article.images?.[0] || '/assets/process-step-2.jpg';
  const galleryList = Array.isArray(article.images) ? article.images.filter(Boolean) : [];

  return (
    <div className="news-modal-overlay" onClick={onClose}>
      <div
        className="news-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Nút đóng */}
        <button className="news-modal-close" onClick={onClose} aria-label="Đóng bài viết">
          <FiX size={20} />
        </button>

        {/* Ảnh bìa bài viết */}
        <div
          className="news-modal-cover"
          onClick={() => setZoomImg(coverUrl)}
          style={{ cursor: 'zoom-in' }}
          title="Bấm để xem ảnh kích thước đầy đủ"
        >
          <img src={coverUrl} alt={article.title} />
          <div className="news-modal-cover-overlay" />
          <div className="news-modal-badge">{article.category}</div>
        </div>

        {/* Nội dung bài viết */}
        <div className="news-modal-content">
          <div className="news-modal-meta">
            <span><FiCalendar size={14} /> {article.date}</span>
            <span>•</span>
            <span><FiClock size={14} /> {article.readTime || '3 phút đọc'}</span>
          </div>

          <h2 className="news-modal-title">{article.title}</h2>

          <div className="news-modal-body">
            <p className="news-lead">{article.excerpt}</p>

            {article.content?.length ? (
              article.content.map((paragraph, idx) => {
                const inlineImg = extractImageUrl(paragraph);
                if (inlineImg) {
                  return (
                    <div key={idx} style={{ margin: '1.25rem 0', textAlign: 'center' }}>
                      <img
                        src={inlineImg}
                        alt={`${article.title} - ảnh ${idx + 1}`}
                        onClick={() => setZoomImg(inlineImg)}
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: 10,
                          border: '1px solid rgba(197, 155, 95, 0.3)',
                          cursor: 'zoom-in',
                        }}
                      />
                    </div>
                  );
                }
                return (
                  <p key={idx} className="news-paragraph">
                    {paragraph}
                  </p>
                );
              })
            ) : (
              <p className="news-paragraph">Nội dung chi tiết đang được cập nhật...</p>
            )}

            {/* Hiển thị danh sách hình ảnh trong bài viết */}
            {galleryList.length > 0 && (
              <div
                style={{
                  margin: '1.25rem 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {galleryList.map((imgUrl, idx) => (
                  <div key={`${imgUrl}-${idx}`} style={{ textAlign: 'center' }}>
                    <img
                      src={imgUrl}
                      alt={`${article.title} - hình ${idx + 1}`}
                      onClick={() => setZoomImg(imgUrl)}
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: 10,
                        border: '1px solid rgba(197, 155, 95, 0.3)',
                        cursor: 'zoom-in',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {article.quote && (
              <blockquote className="news-quote">
                “{article.quote}”
              </blockquote>
            )}

            <div className="news-author-note">
              <strong>Biên tập:</strong> Ban Truyền Thông HTX Dịch Vụ Thương Mại Yến Nhi
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="news-modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Đã sao chép liên kết bài viết!');
              }
            }}
          >
            <FiShare2 size={14} /> Chia sẻ bài viết
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Đóng bài viết
          </button>
        </div>
      </div>

      {/* Lightbox phóng to ảnh */}
      {zoomImg && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setZoomImg(null);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.88)',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            cursor: 'zoom-out',
          }}
        >
          <img
            src={zoomImg}
            alt={article.title}
            style={{
              maxWidth: '95vw',
              maxHeight: '92vh',
              objectFit: 'contain',
              borderRadius: 8,
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      )}
    </div>
  );
}
