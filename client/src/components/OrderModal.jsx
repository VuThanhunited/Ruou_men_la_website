import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiPhone, FiTruck, FiShoppingBag } from 'react-icons/fi';
import '../styles/OrderModal.css';

export default function OrderModal({ orderItem, isOpen, onClose, hotline = '0372.477.078' }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setSubmitted(false);
      setError('');
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !orderItem) return null;

  const unitPrice = orderItem.price || 0;
  const qty = orderItem.quantity || 1;
  const totalPrice = unitPrice * qty;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Vui lòng nhập họ tên và số điện thoại liên hệ');
      return;
    }

    const code = 'YN' + Math.floor(100000 + Math.random() * 900000);
    setOrderCode(code);
    setSubmitted(true);
    setError('');
  };

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div
        className="order-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="order-modal-close" onClick={onClose} aria-label="Đóng popup">
          <FiX size={20} />
        </button>

        {submitted ? (
          /* Màn hình thành công */
          <div className="order-success-box">
            <div className="order-success-icon">
              <FiCheckCircle size={56} />
            </div>
            <h3 className="order-success-title">ĐẶT HÀNG THÀNH CÔNG!</h3>
            <p className="order-success-desc">
              Cảm ơn quý khách <strong>{form.name}</strong> đã tin chọn Rượu Men Lá Yến Nhi.
            </p>
            <div className="order-success-details">
              <div><strong>Mã đơn hàng:</strong> <span className="order-code">{orderCode}</span></div>
              <div><strong>Sản phẩm:</strong> {orderItem.name} ({orderItem.volume}) x {qty}</div>
              {totalPrice > 0 && (
                <div><strong>Tổng tiền:</strong> {totalPrice.toLocaleString('vi-VN')} đ (thanh toán khi nhận hàng)</div>
              )}
              <div><strong>SĐT nhận hàng:</strong> {form.phone}</div>
              {form.address && <div><strong>Địa chỉ:</strong> {form.address}</div>}
            </div>

            <p className="order-note-alert">
              📞 Nhân viên chăm sóc khách hàng của HTX Yến Nhi sẽ gọi điện xác nhận đơn hàng qua số <strong>{form.phone}</strong> trong ít phút.
            </p>

            <div className="order-success-actions">
              <button type="button" className="btn btn-primary" onClick={onClose}>
                HOÀN TẤT
              </button>
              <a href={`tel:${hotline}`} className="btn btn-outline">
                <FiPhone size={15} /> GỌI HỖ TRỢ: {hotline}
              </a>
            </div>
          </div>
        ) : (
          /* Form đặt hàng nhanh */
          <div className="order-form-box">
            <div className="order-modal-header">
              <div className="order-modal-badge">
                <FiTruck size={13} /> GIAO HÀNG TẬN NƠI TOÀN QUỐC
              </div>
              <h2 className="order-modal-title">ĐẶT HÀNG NHANH</h2>
              <p className="order-modal-sub">
                Nhận hàng kiểm tra thanh toán (COD) — Đảm bảo chính gốc HTX Yến Nhi
              </p>
            </div>

            {/* Sản phẩm tóm tắt */}
            <div className="order-product-summary">
              <div className="order-product-thumb">
                {orderItem.thumbnailUrl ? (
                  <img src={orderItem.thumbnailUrl} alt={orderItem.name} />
                ) : (
                  <span>🏺</span>
                )}
              </div>
              <div className="order-product-info">
                <h4>{orderItem.name}</h4>
                <div className="order-product-vol">{orderItem.volume}</div>
                <div className="order-product-qty">Số lượng: <strong>{qty} chai/hộp</strong></div>
              </div>
              <div className="order-product-price">
                {totalPrice > 0 ? (
                  <>{totalPrice.toLocaleString('vi-VN')} đ</>
                ) : (
                  'Giá liên hệ'
                )}
              </div>
            </div>

            {error && <div className="order-error-msg">{error}</div>}

            <form onSubmit={handleSubmit} className="order-form">
              <div className="order-form-group">
                <label>Họ và tên của bạn *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="order-form-group">
                <label>Số điện thoại nhận hàng *</label>
                <input
                  type="tel"
                  placeholder="Ví dụ: 0987 654 321"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>

              <div className="order-form-group">
                <label>Địa chỉ giao hàng</label>
                <input
                  type="text"
                  placeholder="Số nhà, đường/phố, phường/xã, quận/huyện, tỉnh/thành..."
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div className="order-form-group">
                <label>Ghi chú thêm (nếu có)</label>
                <textarea
                  rows="2"
                  placeholder="Ví dụ: Giao giờ hành chính, đóng hộp làm quà biếu..."
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>

              <div className="order-form-actions">
                <button type="submit" className="btn btn-primary btn-submit-order">
                  <FiShoppingBag size={18} /> XÁC NHẬN GỬI ĐƠN HÀNG
                </button>
                <a href={`tel:${hotline}`} className="btn-call-direct">
                  Hoặc gọi hotline trực tiếp: <strong>{hotline}</strong>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
