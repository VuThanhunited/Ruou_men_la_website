import React, { useState, useEffect } from 'react';
import { FiX, FiPhone, FiCheck, FiShoppingBag, FiShield, FiAward, FiTruck } from 'react-icons/fi';
import '../styles/ProductDetailModal.css';

export default function ProductDetailModal({ product, isOpen, onClose, onOrderNow, hotline = '0372.477.078' }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setQuantity(1);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, product]);

  if (!isOpen || !product) return null;

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return Number(price).toLocaleString('vi-VN') + ' đ';
  };

  const handleOrder = () => {
    if (onOrderNow) {
      onOrderNow({ ...product, quantity });
    }
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div
        className="product-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Nút đóng */}
        <button className="product-modal-close" onClick={onClose} aria-label="Đóng popup">
          <FiX size={20} />
        </button>

        <div className="product-modal-grid">
          {/* Cột trái: Ảnh sản phẩm */}
          <div className="product-modal-img-col">
            <div className="product-modal-img-wrap">
              {product.thumbnailUrl ? (
                <img src={product.thumbnailUrl} alt={product.name} />
              ) : (
                <div className="product-modal-placeholder">🏺</div>
              )}
              <span className="product-modal-badge">Ủ CHUM SÀNH TRUYỀN THỐNG</span>
            </div>

            {/* Cam kết nhỏ dưới ảnh */}
            <div className="product-modal-assurances">
              <div className="assurance-item">
                <FiShield className="assurance-icon" />
                <span>100% Men lá rừng tự nhiên</span>
              </div>
              <div className="assurance-item">
                <FiAward className="assurance-icon" />
                <span>Đạt chuẩn ATTP - OCOP</span>
              </div>
              <div className="assurance-item">
                <FiTruck className="assurance-icon" />
                <span>Giao hàng toàn quốc</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Thông tin & Đặt hàng */}
          <div className="product-modal-info-col">
            <div className="product-modal-cat">RƯỢU MEN LÁ YẾN NHI</div>
            <h2 className="product-modal-title">{product.name}</h2>

            <div className="product-modal-meta">
              <div className="product-modal-volume">
                <strong>Quy cách:</strong> {product.volume || 'Chai tiêu chuẩn'}
              </div>
              <div className="product-modal-status">
                <span className="status-dot"></span> Còn hàng
              </div>
            </div>

            <div className="product-modal-price-box">
              <span className="price-label">Giá niêm yết:</span>
              <span className="price-value">{formatPrice(product.price)}</span>
            </div>

            <div className="product-modal-description">
              <p>
                {product.description ||
                  'Rượu Men Lá Yến Nhi được ủ từ gạo nếp nương tuyển chọn cùng hơn 20 vị thảo dược men lá rừng quý hiếm. Rượu được ủ trong chum sành không tráng men trên 12 tháng, cho hương vị êm dịu, ngọt hậu, thơm nồng đặc trưng, uống không khát nước và tuyệt đối không đau đầu.'}
              </p>
            </div>

            {/* Đặc tính nổi bật */}
            <div className="product-modal-specs">
              <div className="spec-row">
                <span className="spec-name">🌾 Nguyên liệu:</span>
                <span className="spec-val">Gạo nếp nương, men lá 20+ vị thuốc thảo dược rừng</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">🏺 Phương pháp:</span>
                <span className="spec-val">Ủ chum sành hạ thổ truyền thống</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">💧 Nồng độ:</span>
                <span className="spec-val">~ 29° - 32° Vol (Êm say vừa vặn)</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">🏡 Xuất xứ:</span>
                <span className="spec-val">HTX Dịch Vụ Thương Mại Yến Nhi - Bắc Ninh</span>
              </div>
            </div>

            {/* Chọn số lượng */}
            <div className="product-modal-qty-row">
              <span className="qty-label">Số lượng:</span>
              <div className="qty-picker">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Giảm"
                >
                  -
                </button>
                <span className="qty-display">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Tăng"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="product-modal-actions">
              <button
                type="button"
                className="btn btn-primary btn-modal-order"
                onClick={handleOrder}
              >
                <FiShoppingBag size={18} /> ĐẶT MUA NGAY
              </button>
              <a
                href={`tel:${hotline}`}
                className="btn btn-outline btn-modal-hotline"
              >
                <FiPhone size={16} /> GỌI: {hotline}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
