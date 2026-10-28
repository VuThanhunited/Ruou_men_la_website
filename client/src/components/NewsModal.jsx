import React, { useEffect } from 'react';
import { FiX, FiCalendar, FiTag, FiClock, FiShare2 } from 'react-icons/fi';
import '../styles/News.css';

export default function NewsModal({ article, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
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
  }, [article, onClose]);

  if (!article) return null;

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
        <div className="news-modal-cover">
          <img src={article.imageUrl} alt={article.title} />
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

            {article.content ? (
              article.content.map((paragraph, idx) => (
                <p key={idx} className="news-paragraph">{paragraph}</p>
              ))
            ) : (
              <p className="news-paragraph">Nội dung chi tiết đang được cập nhật...</p>
            )}

            {article.quote && (
              <blockquote className="news-quote">
                “{article.quote}”
              </blockquote>
            )}

            <div className="news-author-note">
              <strong>Biên tập:</strong> Ban Truyền Thông HTX Yến Nhi • Tuyên Quang
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
    </div>
  );
}
